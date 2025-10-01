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
#    host='pbvweb01v',
    host='pbvweb01v',
    user='ngmai1',
    passwd='TomorrowNgoi',
    database="linebalancing"
)
pd.set_option("display.precision", 2)
engine_hbi_linebalancing = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
engine_hbi_pr2k = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/pr2k', echo=False)
engine_hbi_erpsystem = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/erpsystem', echo=False)
engine_hbi_cutting = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/cutting_system', echo=False)
#hostname='127.0.0.1'
engine_local = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
d_begin=datetime.date(2019,12,27)
testdate=datetime.datetime.today()
week=testdate.isocalendar()[1]
dlimit=testdate.strftime('%Y%m%d')

datef=sys.argv[1]
datet=sys.argv[2]

ds=pd.read_sql('select id,name,op_reg,op_tran,offcode as code,convert(time_in,char) as regtime,duration as spantime,approved as ieapprovedresult,user_approved as ieapproveduser,reason as note from offstandard_employee_tracking where date_in>="'+datef+'" and date_in<="'+datet+'"  order by regtime;',engine_hbi_cutting)
engine_hbi_linebalancing.dispose()
linksave=os.getcwd()
linksave.replace('\\','\\\\')
datef=datef.replace('/','_')
datet=datef.replace('/','_')
ds.to_excel(linksave+'\\pyScript\\excelfile\\'+'offstd_'+datef[:10]+'_to_'+datet[:10]+'.xlsx')
print('success')