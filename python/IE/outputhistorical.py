import sys, json
import os
import mysql.connector
import string
import pandas as pd
from sqlalchemy import create_engine
#import random
import datetime
import numpy as np

mydb=mysql.connector.connect(
#    host='localhost',
    host='pbvweb01v',
    user='ngmai1',
    passwd='TomorrowNgoi',
    database="linebalancing"
)
pd.set_option("display.precision", 2)
engine_hbi_linebalancing = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
engine_hbi_pr2k = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/pr2k', echo=False)
engine_hbi_erpsystem = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/erpsystem', echo=False)
#hostname='127.0.0.1'
engine_local = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@localhost:3306/linebalancing', echo=False)
# d_begin=datetime.date(2019,12,27)
# testdate=datetime.datetime.today()
# week=testdate.isocalendar()[1]
# dlimit=testdate.strftime('%Y%m%d')
group=sys.argv[1]
namegroup=str(group[:3])+str(group[-2:])
dk='DATE>"2020-07-15" AND namegroup="'+namegroup+'"'
date_current=datetime.date.today()
dlimit=date_current.strftime('%Y-%m-%d')
sql_style=('SELECT cast(style_d.date as char) as date,style_d.shift,style_d.style_detail,o.output,style_d.mo,round(style_d.mo/o.output,2) as rate FROM (SELECT maxo.date,maxo.shift,allo.style_detail,maxo.mo from '
          +'(SELECT sty.date,sty.shift,MAX(sty.opbs) AS mo FROM (SELECT sub1.date,sub1.shift,sub1.style_detail,SUM(sub1.output) AS opbs from '
          +'(SELECT od.date,od.shift,od.selling_style,od.style_detail,od.size,SUM(od.op) AS output from '
          +'(SELECT st.date,st.shift,st.selling_style,aci.style_detail,st.size,st.op from '
          +'(SELECT sc.DATE,sc.shift,sc.lot,wl.selling_style,wl.size,sc.op from (SELECT date,shift,lot,SUM(dzcase) AS op FROM data_finishedgoodssewing WHERE '+dk
          +' GROUP BY DATE,shift,lot) AS sc INNER JOIN pr2k.worklot_active wl ON sc.lot=wl.ass_lot WHERE wl.selling_style!="None" '
          +'GROUP by sc.date,sc.shift,wl.SELLING_STYLE,wl.size,sc.op) AS st INNER JOIN linebalancing.aci_data aci ON st.selling_style=aci.SELLING_GARMENT GROUP BY '
          +'st.date,st.shift,st.selling_style,aci.style_detail,st.size,st.op) od GROUP BY od.date,od.shift,od.style_detail,od.size) AS sub1 GROUP BY '
          +'sub1.date,sub1.shift,sub1.style_detail) AS sty GROUP BY sty.date,sty.shift) AS maxo INNER JOIN '
          +'(SELECT sub1.date,sub1.shift,sub1.style_detail,SUM(sub1.output) AS opbs from '
          +'(SELECT od.date,od.shift,od.selling_style,od.style_detail,od.size,SUM(od.op) AS output from '
          +'(SELECT st.date,st.shift,st.selling_style,aci.style_detail,st.size,st.op from '
          +'(SELECT sc.DATE,sc.shift,sc.lot,wl.selling_style,wl.size,sc.op from (SELECT date,shift,lot,SUM(dzcase) AS op '
          +'FROM data_finishedgoodssewing WHERE '+dk+' GROUP BY DATE,shift,lot) AS sc INNER JOIN pr2k.worklot_active wl ON '
          +'sc.lot=wl.ass_lot WHERE wl.selling_style!="None" GROUP by sc.date,sc.shift,wl.SELLING_STYLE,wl.size,sc.op) AS st INNER JOIN linebalancing.aci_data aci '
          +'ON st.selling_style=aci.SELLING_GARMENT GROUP BY st.date,st.shift,st.selling_style,aci.style_detail,st.size,st.op) od GROUP BY od.date,od.shift,od.style_detail,od.size) '
          +'AS sub1 GROUP BY sub1.date,sub1.shift,sub1.style_detail) AS allo ON (maxo.mo=allo.opbs AND maxo.date=allo.date AND maxo.shift=allo.shift)) AS style_d LEFT JOIN '
          +'(SELECT DATE,shift,SUM(dzcase) AS output FROM data_finishedgoodssewing WHERE '+dk+' GROUP BY DATE,shift) '
          +'AS o ON (style_d.date=o.date and style_d.shift=o.shift) order by date desc')
sql_size=('SELECT cast(maxo.date as char) as date,maxo.shift,allo.size,maxo.mo from (SELECT sty.date,sty.shift,MAX(sty.opbs) AS mo FROM '
         +'(SELECT sub1.date,sub1.shift,sub1.size,SUM(sub1.output) AS opbs from (SELECT od.date,od.shift,od.selling_style,od.style_detail,od.size,SUM(od.op) AS output from '
         +'(SELECT st.date,st.shift,st.selling_style,aci.style_detail,st.size,st.op from '
         +'(SELECT sc.DATE,sc.shift,sc.lot,wl.selling_style,wl.size,sc.op from (SELECT date,shift,lot,SUM(dzcase) AS op FROM data_finishedgoodssewing WHERE '+dk
         +' GROUP BY DATE,shift,lot) AS sc INNER JOIN pr2k.worklot_active wl ON sc.lot=wl.ass_lot WHERE wl.selling_style!="None" GROUP by '
         +'sc.date,sc.shift,wl.SELLING_STYLE,wl.size,sc.op) AS st INNER JOIN linebalancing.aci_data aci ON st.selling_style=aci.SELLING_GARMENT GROUP BY '
         +'st.date,st.shift,st.selling_style,aci.style_detail,st.size,st.op) od GROUP BY od.date,od.shift,od.style_detail,od.size) AS sub1 GROUP BY sub1.date,sub1.shift,sub1.size)'
         +'AS sty GROUP BY sty.date,sty.shift) AS maxo INNER JOIN (SELECT sub1.date,sub1.shift,sub1.size,SUM(sub1.output) AS opbs from '
         +'(SELECT od.date,od.shift,od.selling_style,od.style_detail,od.size,SUM(od.op) AS output from '
         +'(SELECT st.date,st.shift,st.selling_style,aci.style_detail,st.size,st.op from (SELECT sc.DATE,sc.shift,sc.lot,wl.selling_style,wl.size,sc.op from '
         +'(SELECT date,shift,lot,SUM(dzcase) AS op FROM data_finishedgoodssewing WHERE '+dk+' GROUP BY DATE,shift,lot) AS sc INNER JOIN pr2k.worklot_active wl ON '
         +'sc.lot=wl.ass_lot WHERE wl.selling_style!="None" GROUP by sc.date,sc.shift,wl.SELLING_STYLE,wl.size,sc.op) AS st INNER JOIN linebalancing.aci_data aci ON '
         +'st.selling_style=aci.SELLING_GARMENT GROUP BY st.date,st.shift,st.selling_style,aci.style_detail,st.size,st.op) od GROUP BY od.date,od.shift,od.style_detail,od.size) '
         +'AS sub1 GROUP BY sub1.date,sub1.shift,sub1.size) AS allo ON (maxo.mo=allo.opbs AND maxo.date=allo.date AND maxo.shift=allo.shift) order by date desc')
# style=pd.read_sql(sql_style+';',engine_hbi_erpsystem)
# size=pd.read_sql(sql_size+';',engine_hbi_erpsystem)
sql_all='select st.date,st.shift,st.style_detail,st.output,st.rate,round(si.mo/st.output,2) as RSize,si.size as Size from ('+sql_style+') as st left join ('+sql_size+') as si on st.date=si.date and st.shift=si.shift where st.date<"'+dlimit+'" order by date desc;'
style=pd.read_sql(sql_all,engine_hbi_erpsystem)
# print(style)
# print(size)
# size_detail=[]
# o_size=[]
# r_size=[]
# i=0
# while i<len(size):
#     size_detail.append(size.iloc[i,2])
#     o_size.append(size.iloc[i,3])
#     r_size.append(round(size.iloc[i,3]/style.iloc[i,3],2))
#     i=i+1
# style["Size"]=size_detail
# style["OSize"]=o_size
# style["RSize"]=r_size
# print(style)
# abc={'kq_cbc':kq,'ds':ds_final.to_json(orient="records"),'cbc':cbc.to_json(orient="records")}

print(style.to_json(orient="records"))
# style_detail="BB 7764/7800-color"
# i=0
# dat=[]
# shi=[]
# sty=[]
# siz=[]
# opu=[]
# while i<len(style):
#     if (style.iloc[i,2]==style_detail):
#         dat.append(style.iloc[i,0])
#         shi.append(style.iloc[i,1])
#         sty.append(style.iloc[i,2])
#         siz.append(style.iloc[i,4])
#         opu.append(style.iloc[i,3])
#     i=i+1
# datasort={"DATE":dat,"SHIFT":shi,"STYLE":sty,"SIZE":siz,"OUTPUT":opu}
# dataprint=pd.DataFrame(datasort)
# print(dataprint)