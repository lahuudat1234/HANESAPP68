from hashlib import sha1
import sys, json
import os
import mysql.connector
import string
import pandas as pd
from sqlalchemy import create_engine
#import random
import datetime
import numpy as np
import math

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
#hostname='127.0.0.1'
engine_local = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
d_begin=datetime.date(2021,12,26)
testdate=datetime.datetime.today()
week=testdate.isocalendar()[1]
dlimit=testdate.strftime('%Y%m%d')

# '051-058', 'Woven Boxer-Exposed WB', 'RIT', 'Normal', ''
# group="204-210"
# shift="BALI"
# style_detail="BX Normal"
# size="Normal"
# ie_cbc=""
# week_cbc="24"
group=sys.argv[1]
shift=sys.argv[3]
style_detail=sys.argv[2]
size=sys.argv[4]
ie_cbc=sys.argv[5]
week_cbc=sys.argv[6]
year_cbc="2022"
if int(week_cbc)>30:
    year_cbc="2021"
try:
    week=int(week_cbc)
except:
    week=testdate.isocalendar()[1]
if week==0:
    week_cbc=0
    week=testdate.isocalendar()[1]
else:
    date_end=d_begin+datetime.timedelta(days=(week-1)*7)
    # date_end=datetime.date(2020,12,27)
    dlimit=date_end.strftime('%Y%m%d')
sizeBOL="L"
if size=="Normal":
    range_size='(size="S" or size="M" or size="L" or size="XL")'
    range_size_ex='(size="S" or size="M" or size="L" or size="XL")'
if size=="BIG":
    range_size='(size="2X" or size="2XL" or size="3X" or size="3XL")'
    range_size_ex='(size="2X" or size="2XL" or size="3X" or size="3XL" or size="XL")'
    sizeBOL="2X"
if size=="SMALL":
    range_size='size="S"'
    range_size_ex='(size="S" or size="M")'
if size=="BOY":
    range_size='(size="2" or size="3" or size="4")'
    range_size_ex='(size="2" or size="3" or size="4" or size="S")'
    sizeBOL="3"
sql_mnf=('select mn.selling,mn.style,mn.timeupdate from (SELECT style.selling,wl.style,wl.TimeUpdate FROM (SELECT selling_garment AS selling FROM linebalancing.aci_data aci WHERE'
        +' aci.style_detail="'+style_detail+'" GROUP BY selling_garment) AS style INNER JOIN pr2k.worklot_active wl ON style.selling=wl.SELLING_STYLE '
        +' group by style) as mn inner join pr2k.operation_sequence sq on mn.style=sq.MFG where sq.MFG is not null and sq.MFG<>"SLTR" group by style ORDER BY mn.timeupdate desc;')

sql_mnf=('select mn.selling,mn.style,mn.tu from (SELECT style.selling,wl.style,date(wl.TimeUpdate) AS tu FROM '
        +'(SELECT selling_garment AS selling FROM linebalancing.aci_data aci WHERE '
        +'aci.style_detail="'+style_detail+'" GROUP BY selling_garment) AS style '
        +'INNER JOIN pr2k.worklot_active wl ON style.selling=wl.SELLING_STYLE group by selling,style,tu ORDER BY tu DESC LIMIT 2) as mn '
        +'inner join pr2k.operation_sequence sq on mn.style=sq.MFG where sq.MFG is not null and sq.MFG<>"SLTR" group by style ORDER BY mn.tu desc;')


dt_mnf=pd.read_sql(sql_mnf,engine_hbi_pr2k)



engine_hbi_linebalancing.dispose()
mnf="abcd"
try:
    mnf=str(dt_mnf.iloc[0,1])
except:
    mnf="abcd"
if style_detail=="BX Todder Boy" or style_detail=="BX Todler boy":
    mnf="UHN7"
if style_detail=="CSWB-BL seam gusset_Heat seal logo":
    mnf="JAG5"
if style_detail=="BL normal (2393/7347)":
    mnf="L76ANW"
if style_detail=="BX jersey (60%C: 40% Rayon)":
    mnf="UMBP"
if style_detail=="BX Seam panel with tape":
    mnf="UBN0"
if style_detail=="Knit 548-Hemleg 605":
    mnf="AMFJ"
if style_detail=="BX make dark":
    mnf="BUZ2"
if style_detail=="BX Seam panel with tape (No bindpanel/Todder boy)":
    mnf="URJP"
if style_detail=="BX polyester 100%":
    mnf="JXP4"
if style_detail=="HEI wt short tape":
    mnf="HEB158"
if style_detail=="HEI Tee shirt short sleeves":
    mnf="HEB119"
if style_detail=="BL normal (2393/7347)":
    mnf="PDS2"
if style_detail=="Knit 548":
    mnf="5KRS"
if style_detail=="BX Boy Rayon" and size=="Normal":
    mnf="UN2S"
if style_detail=="BX Boy" and size=="Normal":
    mnf="UMHH"
if style_detail=="BX Boy" and size=="BOY":
    mnf="U19A"
if style_detail=="B755 new const" and size=="BOY":
    mnf="UTAD"
if style_detail=="BX Normal (Inside Front Panel With Mesh)":
    mnf="H9BE"
if style_detail=="Sling Boxer":
    mnf="LLEG"
if style_detail=="BX (Poly 87%/13%-92%/8%-SPI 16, Hemleg, Sewband, Bindpanel) wt pocket":
    mnf="RUBL"
if style_detail=="BX jersey (60%C: 40% Rayon)(Care lable)":
    mnf="UB9A"
if style_detail=="BX Seam panel with tape,set joke label, hem leg 605":
    mnf="UBS2"
if style_detail=="BB Dye side Stitch":
    mnf="N7SP"
if style_detail=="5 boxer-100% polyester":
    mnf="UC9W"
if style_detail == "5PBX Sewcenter, seam gusset":
    mnf = "LUCMNW"

sql_opst='SELECT operation,sequence,round(earned_hours*180,2) AS sam FROM pr2k.operation_sequence WHERE mfg="'+mnf+'" AND size="'+sizeBOL+'" AND operation!="MOVER 1" AND operation!="MOVER 2" AND operation!="MOVER 3" and operation!="PACKING" and operation!="PAD PRINT";'
    # print(sql_sam)
dt_opst=pd.read_sql(sql_opst,engine_hbi_linebalancing)
engine_hbi_linebalancing.dispose()
sql_wc=pd.read_sql('select workcenter from aci_data where workcenter is not null and style_detail="'+style_detail+'";',engine_hbi_linebalancing)
engine_hbi_linebalancing.dispose()
try:
    wc=sql_wc.iloc[0,0]
except:
    wc="botay"
# print(wc)
 #employee                NAME      line shift namegroup  work_hs   OPERATION     EFF      Style  Var IE
# sql_ds_hc=('SELECT ds.employee,ds.name,ds.line,ds.shift,ds.namegroup,ds.work_hs,ds.OPERATION,ds.EFF,ds.Style,ds.Var,ds.IE from '
#             +'(select right(employee,5) AS employee,NAME,groupline as line,shift,groupline as namegroup,work_hs,OPERATION,EFF,style_refer as Style,'
#             +'Var,ieu as IE from employee_eff_data_ie_setup_temp where groupline="'+group+'" and shift like "'+shift+'%" and style_detail="'+style_detail+'" and size="'+size+'" and '
#             +'WEEK="'+str(week)+'" and keye LIKE "'+str(week)+'%") AS ds left JOIN (SELECT right(emp.ID,5) AS idx,emp.WEEK,emp.line_new AS line,emp.ML,emp.shift_new FROM'
#             +' linebalancing.setup_emplist emp inner JOIN (SELECT line FROM web_ie_location lc WHERE groupname="'+group+'") AS gr '
#             +'ON (emp.line_new=gr.line) WHERE (emp.shift_new LIKE"'+shift+'%") AND emp.week="'+str(week)+'" AND ml="" GROUP BY idx) AS hc '
#             +'ON ds.employee=hc.idx WHERE hc.idx IS NOT NULL GROUP BY hc.idx;')
ds=pd.read_sql('select employee,NAME,groupline as line,shift,groupline as namegroup,work_hs,OPERATION,EFF,style_refer as Style,Var,ieu as IE from employee_eff_data_ie_setup_temp where groupline="'+group+'" and shift like "'+shift+'%" and style_detail="'+style_detail+'" and size="'+size+'" and week="'+str(week_cbc)+'" and year(timeupdate)="'+str(year_cbc)+'" group by employee;',engine_hbi_linebalancing)
# print(ds)

sql_ds_hc=('SELECT hc.idx AS employee,hc.NAME,hc.line,hc.shift,hc.namegroup,hc.work_hs,ds.OPERATION,ds.EFF,ds.Style'
            +',ds.Var,ds.IE,ds.DK7K from (select right(employee,5) AS employee,NAME,groupline as line,shift,groupline as '
            +'namegroup,work_hs,OPERATION,EFF,style_refer as Style,Var,ieu as IE,DK7K from employee_eff_data_ie_setup_temp '
            +'where groupline="'+group+'" and shift like "'+shift+'%" and style_detail="'+style_detail+'" and size="'+size+'" '
            +'and WEEK="'+str(week)+'" and year(timeupdate)="'+str(year_cbc)+'") AS ds Right JOIN (SELECT right(emp.ID,5) AS idx,emp.name,'
            +'emp.WEEK,emp.line_new AS line,emp.ML,emp.shift_new AS shift,gr.groupname AS namegroup,if((INSTR(emp.shift,"MAT")>0 OR (INSTR(emp.shift,"CHILD")>0)),382,442) '
            +'AS work_hs FROM linebalancing.setup_emplist emp inner JOIN (SELECT line,groupname FROM web_ie_location lc WHERE '
            +'groupname="'+group+'") AS gr ON (emp.line_new=gr.line) WHERE (emp.shift_new LIKE"'+shift+'%") AND emp.week="'+str(week)+'" and year(emp.dateupdate)="'+str(year_cbc)+'" '
            +'AND ml="" GROUP BY idx) AS hc ON ds.employee=hc.idx WHERE hc.idx IS NOT NULL GROUP BY hc.idx;')


# print(sql_ds_hc)

if week_cbc!=0 and len(ds)>0:
    ds=pd.read_sql(sql_ds_hc,engine_hbi_linebalancing)
    engine_hbi_linebalancing.dispose()
    ds['OPERATION'].replace(to_replace = [None], value ="ie_assign",inplace=True)
    ds['Style'].replace(to_replace = [None], value ="ie_assign",inplace=True)
    ds['EFF'].replace(to_replace = pd.np.NAN, value =0,inplace=True)
    ds['Var'].replace(to_replace = pd.np.NAN, value =0,inplace=True)
    ds['IE'].replace(to_replace = [None], value =ie_cbc,inplace=True)
    ds['DK7K'].replace(to_replace = [None], value ="0",inplace=True)
# print(ds)
# print(len(ds))
if len(ds)==0 or week_cbc==0:
    # print("normal")
    sql_ds=('SELECT RIGHT(e.id,5) as employee,e.NAME,e.line_new as line,e.shift_new as shift,g.groupname,if((INSTR(e.shift_new,"MAT")>0 OR (INSTR(e.shift_new,"CHILD")>0)),382,442)  as work_hs FROM linebalancing.setup_emplist e INNER JOIN linebalancing.web_ie_location g ON e.Line_new=g.line WHERE e.ML="" AND e.line_new<"line 354" '
            +'and g.groupname="'+group+'" AND e.shift_new LIKE "'+shift+'%" and e.week="'+str(week)+'" and year(e.dateupdate)="'+str(year_cbc)+'" group by employee;')
    # print(sql_ds)
    ds=pd.read_sql(sql_ds,engine_hbi_linebalancing)
    # print(ds)
    engine_hbi_linebalancing.dispose()
    operation=[]
    eff=[]
    ie_data=[]
    style_cal=[]
    eff_ref_m=[]
    dk7k=[]
    i=0
    while i< len(ds):
        eff_emp=0
        refer=0
        style_refer=style_detail
        eff_ref=0
        emp=str(ds.iloc[i,0])
        ie="0"
        dklist="0"
        opr="ie_assign"
        # select from IE assign
        web_ie=pd.read_sql('select operation_name,eff,ie from web_ie_update where employee="'+emp+'" and style_detail="'+style_detail+'" and range_size="'+size+'" and week="'+str(week)+'" and date_update>"20220101";',engine_hbi_linebalancing)
        if len(web_ie)>0:
            opr=web_ie.iloc[0,0]
            eff_emp=web_ie.iloc[0,1]
            ie=web_ie.iloc[0,2]
        if opr=="ie_assign":
            sql_op=(
                    'SELECT sample.operation_name,COUNT(sample.DATE) AS rf FROM '
                    +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail '
                    +'WHERE operation_name is not null and float_eff IS NOT NULL AND FLOAT_eff<300 and '
                    +'employee="'+emp+'" AND style_detail="'+style_detail+'" ORDER BY DATE DESC LIMIT 14) AS sample GROUP BY sample.operation_name ORDER BY rf desc;'
                )
            # print(sql_op)
            dt_op=pd.read_sql(sql_op,engine_hbi_linebalancing)
            # print(dt_op)
            engine_hbi_linebalancing.dispose()
            j=0
            # opr="ie_assign"
            while(j<len(dt_op) and len(dt_op)>0 and opr=="ie_assign"):
                opr=str(dt_op.iloc[j,0])
                if opr=="None" or dt_op.iloc[j,0]=="ie_assign" or dt_op.iloc[j,0]=="PAD PRINT" or dt_op.iloc[j,0]=="MAKE BAND" or dt_op.iloc[j,0]=="PACKING" or dt_op.iloc[j,0]=="MOVER 3" or dt_op.iloc[j,0]=="MOVER 2" or dt_op.iloc[j,0]=="MOVER 1" :
                    opr="ie_assign"
                else:
                    opr=dt_op.iloc[j,0]
                    check_st=0
                    k=0
                    while k<len(dt_opst) and check_st==0:
                        if opr==dt_opst.iloc[k,0] or opr=="CASING":
                            check_st=1
                        k=k+1
                    if check_st==0:
                        opr="ie_assign"
                j=j+1

            # sql_sam='SELECT sq,round(sah*180,2) AS sam FROM setup_operation_sam WHERE operation="'+OP+'" AND mfg="'+mnf+'" AND size="'+size+'";'
            # # print(sql_sam)
            # dt_sam=pd.read_sql(sql_sam,engine_hbi_linebalancing)
            
            if opr=="ie_assign":
                refer=1
                # sql_op_op=(
                #     'SELECT dt2.max_rf,dt3.operation_name FROM (SELECT MAX(rf) AS max_rf FROM '
                #     +'(SELECT sample.operation_name,COUNT(sample.DATE) AS rf FROM '
                #     +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE operation_name is not null and float_eff IS NOT NULL AND FLOAT_eff<300 and employee="'+emp+'" AND workcenter="'+wc+'" ORDER BY DATE DESC LIMIT 30) AS sample '
                #     +'GROUP BY sample.operation_name) AS dt) AS dt2 INNER JOIN '
                #     +'(SELECT sample2.operation_name,COUNT(sample2.DATE) AS rf FROM '
                #     +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE operation_name is not null and float_eff IS NOT NULL AND FLOAT_eff<300 and employee="'+emp+'" AND workcenter="'+wc+'" ORDER BY DATE DESC LIMIT 30) AS sample2 '
                #     +'GROUP BY sample2.operation_name) AS dt3 ON dt2.max_rf=dt3.rf;'
                # )

                sql_op_op=(
                            'SELECT operation_name,COUNT(DATE) AS rf from '
                            +'(SELECT operation_name,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE operation_name is not null and float_eff IS NOT NULL AND FLOAT_eff<300 and '
                            +'employee="'+emp+'" AND Workcenter="'+wc+'" ORDER BY DATE DESC LIMIT 30) AS temp GROUP BY operation_name ORDER BY rf desc;'
                )
                # print(sql_op_op)
                dt_op2=pd.read_sql(sql_op_op,engine_hbi_linebalancing)
                engine_hbi_linebalancing.dispose()
                # print(dt_op2)
                j=0
                while(j<len(dt_op2) and len(dt_op2)>0 and opr=="ie_assign"):
                    opr=str(dt_op2.iloc[j,0])
                    if opr=="None" or dt_op2.iloc[j,0]=="ie_assign" or dt_op2.iloc[j,0]=="PAD PRINT" or dt_op2.iloc[j,0]=="MAKE BAND" or dt_op2.iloc[j,0]=="PACKING" or dt_op2.iloc[j,0]=="MOVER 3" or dt_op2.iloc[j,0]=="MOVER 2" or dt_op2.iloc[j,0]=="MOVER 1" or dt_op2.iloc[j,0]=="CLIP THREAD"  :
                        opr="ie_assign"
                    else:
                        opr=dt_op2.iloc[j,0]
                        check_st=0
                        k=0
                        while k<len(dt_opst) and check_st==0:
                            if opr==dt_opst.iloc[k,0] or opr=="CASING":
                                check_st=1
                            k=k+1
                        if check_st==0:
                            opr="ie_assign"
                    j=j+1
                if opr!="ie_assign":
                    style_referx=(
                            'SELECT sample3.max_day,sample5.style_detail FROM (SELECT MAX(days) AS max_day FROM '
                            +'(SELECT style_detail,COUNT(DATE) AS days FROM (SELECT operation_name,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail '
                            +'WHERE operation_name is not null and float_eff IS NOT NULL AND FLOAT_eff<300 and employee="'+emp+'" AND Workcenter="'+wc+'" ORDER BY DATE DESC LIMIT 30)AS sample '
                            +'WHERE operation_name="'+opr+'" GROUP BY style_detail) AS sample2) AS sample3 INNER JOIN (SELECT style_detail,COUNT(DATE) AS days FROM '
                            +'(SELECT operation_name,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE operation_name is not null and float_eff IS NOT NULL AND FLOAT_eff<300 '
                            +'and employee="'+emp+'" AND Workcenter="'+wc+'" ORDER BY DATE DESC LIMIT 30)AS sample4 '
                            +'WHERE operation_name="'+opr+'" GROUP BY style_detail) AS sample5 ON sample3.max_day=sample5.days;'
                    )
                    dt_style_refer=pd.read_sql(style_referx,engine_hbi_linebalancing)
                    engine_hbi_linebalancing.dispose()
                    style_refer=dt_style_refer.iloc[0,1]
            # tính hiệu suất 7000k
            



            eff2=36
            eff1=36
            dkstyle='(style_detail like "'+style_detail+'%")'
            ie_approve=pd.read_sql('select * from web_ie_style_refer where operation="'+opr+'" and style_detail="'+style_detail+'";',engine_hbi_linebalancing)
            engine_hbi_linebalancing.dispose()
            if len(ie_approve)>0:
                st=0
                dkstyle='((style_detail="'+style_detail+'"'
                while st<len(ie_approve):
                    dkstyle+=' or style_detail="'+ie_approve.iloc[st,2]+'"'
                    st=st+1
                dkstyle+=') or style_detail like "'+style_detail+'%")'
                refer=0
            if (opr!="ie_assign" and refer==0):
                try:
                    sql_eff1=(
                                'SELECT avg(FLOAT_eff) FROM '
                                +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE '+range_size+' and float_eff IS NOT NULL AND FLOAT_eff<300 and operation_name="'+opr+'" and employee="'+emp+'" AND '+dkstyle+' AND DATE<"'+str(dlimit)+'" ORDER BY DATE DESC LIMIT 14) AS sample;'
                    )
                    # print(sql_eff1)
                    dt_eff1=pd.read_sql(sql_eff1,engine_hbi_linebalancing)
                    engine_hbi_linebalancing.dispose()
                    eff1=int(dt_eff1.iloc[0,0])
                except:
                    sql_eff1=(
                                'SELECT avg(FLOAT_eff) FROM '
                                +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE '+range_size_ex+' and float_eff IS NOT NULL AND FLOAT_eff<300 and operation_name="'+opr+'" and employee="'+emp+'" AND '+dkstyle+' AND DATE<"'+str(dlimit)+'" ORDER BY DATE DESC LIMIT 14) AS sample;'
                    )
                    dt_eff1=pd.read_sql(sql_eff1,engine_hbi_linebalancing)
                    engine_hbi_linebalancing.dispose()
                try:
                    eff1=int(dt_eff1.iloc[0,0])
                except:
                    eff1=36
                    # print('eff _ error ' ,emp)

            if (opr!="ie_assign" and refer==0 and eff1==36):
                try:
                    sql_eff1=(
                                'SELECT avg(FLOAT_eff) FROM '
                                +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE '+range_size_ex+' and float_eff IS NOT NULL AND FLOAT_eff<300 and operation_name="'+opr+'" and employee="'+emp+'" AND '+dkstyle+' AND DATE<"'+str(dlimit)+'" ORDER BY DATE DESC LIMIT 14) AS sample;'
                    )
                    dt_eff1=pd.read_sql(sql_eff1,engine_hbi_linebalancing)
                    engine_hbi_linebalancing.dispose()
                    eff1=int(dt_eff1.iloc[0,0])
                except:
                    eff1=36
            
            if (opr!="ie_assign" and refer==0 and eff1!=36):
                # efftop=str(int(eff1+50))   
                geff=40
                if eff1>80:
                    geff=40
                if eff1>100:
                    geff=30
                if eff1>110:
                    geff=20
                efftop=str(int(eff1+geff))
                try:
                    sql_eff2=(
                                'SELECT avg(FLOAT_eff) FROM '
                                +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE '+range_size+' and float_eff IS NOT NULL AND FLOAT_eff>'+str(eff1)+' AND FLOAT_eff<'+efftop+' and operation_name="'+opr+'" and employee="'+emp+'" AND '+dkstyle+' AND DATE<"'+str(dlimit)+'" ORDER BY DATE DESC LIMIT 14) AS sample;'
                    )
                    dt_eff2=pd.read_sql(sql_eff2,engine_hbi_linebalancing)
                    engine_hbi_linebalancing.dispose()
                    eff2=float(dt_eff2.iloc[0,0])
                except:
                    sql_eff2=(
                                'SELECT avg(FLOAT_eff) FROM '
                                +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE '+range_size_ex+' and float_eff IS NOT NULL AND FLOAT_eff>'+str(eff1)+' and operation_name="'+opr+'" AND FLOAT_eff<'+efftop+' and employee="'+emp+'" AND '+dkstyle+' AND DATE<"'+str(dlimit)+'" ORDER BY DATE DESC LIMIT 14) AS sample;'
                    )
                    # print(sql_eff2)
                    dt_eff2=pd.read_sql(sql_eff2,engine_hbi_linebalancing)
                    engine_hbi_linebalancing.dispose()
                    try:
                        eff2=float(dt_eff2.iloc[0,0])
                    except:
                        eff2=eff1
                        # print(sql_eff1)
                        # print(sql_eff2)
                        # print(emp,' no eff ',opr)
            # refer workcenter
            if (eff1==36 and eff2==36):
                refer=1
                # style_refer=dt_style_refer.iloc[0,1]
            if (opr!="ie_assign" and refer==1):
                dt_efftb2=pd.read_sql('select avg(float_eff) from bundle_group_by_employee_detail where style_detail="'+style_refer+'" and '+range_size+' and operation_name="'+opr+'" and float_eff is not null and float_eff>60 and float_eff<300 AND DATE<"'+str(dlimit)+'" and (date<"20211104" or date>"20220409");',engine_hbi_linebalancing)
                dt_efftb1=pd.read_sql('select avg(float_eff) from bundle_group_by_employee_detail where '+dkstyle+' and '+range_size+' and operation_name="'+opr+'" and float_eff is not null and float_eff>60 and float_eff<300 AND DATE<"'+str(dlimit)+'" and (date<"20211104" or date>"20220409");',engine_hbi_linebalancing)
                engine_hbi_linebalancing.dispose()
                try:
                    eff_ref=-dt_efftb2.iloc[0,0]+dt_efftb1.iloc[0,0]
                except:
                    eff_ref=0
                try:
                    sql_eff1=(
                                'SELECT avg(FLOAT_eff) FROM '
                                +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE '+range_size+' and float_eff IS NOT NULL AND FLOAT_eff<300 and operation_name="'+opr+'" and employee="'+emp+'" AND workcenter="'+wc+'" AND DATE<"'+str(dlimit)+'" and (date<"20211104" or date>"20220409") ORDER BY DATE DESC LIMIT 30) AS sample;'
                    )
                    dt_eff1=pd.read_sql(sql_eff1,engine_hbi_linebalancing)
                    eff1=int(dt_eff1.iloc[0,0])
                except:
                    sql_eff1=(
                                'SELECT avg(FLOAT_eff) FROM '
                                +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE '+range_size_ex+' and float_eff IS NOT NULL AND FLOAT_eff<300 and operation_name="'+opr+'" and employee="'+emp+'" AND workcenter="'+wc+'" AND DATE<"'+str(dlimit)+'" and (date<"20211104" or date>"20220409") ORDER BY DATE DESC LIMIT 30) AS sample;'
                    )
                    dt_eff1=pd.read_sql(sql_eff1,engine_hbi_linebalancing)
                try:
                    eff1=int(dt_eff1.iloc[0,0])
                except:
                    e=1
                    # print('eff _ error ' ,emp)
            if (opr!="ie_assign" and refer==1):
                # efftop=str(int(eff1+50))
                geff=40
                if eff1>80:
                    geff=40
                if eff1>100:
                    geff=30
                if eff1>110:
                    geff=20
                efftop=str(int(eff1+geff))
                try:
                    sql_eff2=('SELECT avg(FLOAT_eff) FROM '
                                +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE '+range_size+' and float_eff IS NOT NULL AND FLOAT_eff>'+str(eff1)+' AND FLOAT_eff<'+efftop+' and operation_name="'+opr+'" and employee="'+emp+'" AND workcenter="'+wc+'" AND DATE<"'+str(dlimit)+'" and (date<"20211104" or date>"20220409") ORDER BY DATE DESC LIMIT 30) AS sample;'
                    )
                    dt_eff2=pd.read_sql(sql_eff2,engine_hbi_linebalancing)
                    eff2=float(dt_eff2.iloc[0,0])
                except:
                    sql_eff2=('SELECT avg(FLOAT_eff) FROM '
                                +'(SELECT operation_name,size,style_detail,workcenter,DATE,float_eff FROM bundle_group_by_employee_detail WHERE '+range_size_ex+' and float_eff IS NOT NULL AND FLOAT_eff>'+str(eff1)+' and operation_name="'+opr+'" AND FLOAT_eff<'+efftop+' and employee="'+emp+'" AND workcenter="'+wc+'" AND DATE<"'+str(dlimit)+'" and (date<"20211104" or date>"20220409") ORDER BY DATE DESC LIMIT 30) AS sample;'
                    )
                    # print(sql_eff2)
                    dt_eff2=pd.read_sql(sql_eff2,engine_hbi_linebalancing)
                    try:
                        eff2=float(dt_eff2.iloc[0,0])
                    except:
                        # print(sql_eff2)
                        eff2=eff1
            eff_emp=eff2+eff_ref
            dklist="0"
            # if size=="Normal":
            #     dk_7k=pd.read_sql('select dk.employee,dk.operation,tg.efficiency from data_operation_7000_register dk left join setup_operation_7000_target tg on dk.operation=tg.operation where dk.employee="'+str(emp)+'" and dk.operation="'+opr+'";',engine_hbi_linebalancing)
            #     if len(dk_7k)>0:
            #         dklist="YES"
            #         # try:
            #         #     if dk_7k.iloc[0,2]>eff_emp+10:
            #         #         eff_emp=eff_emp+2.5
            #         #     else:
            #         #         if  dk_7k.iloc[0,2]>eff_emp:
            #         #             eff_emp=eff_emp+0.25*(dk_7k.iloc[0,2]-eff_emp)
            #         # except:
            #         #     eff_emp=eff_emp
            #         #     dklist="0"
            #     else:
            #         dklist="0"
            # else:
            #     dklist="0"

            # finish refer
        if refer==0:
            style_refer=style_detail
        ie_data.append(ie)
        dk7k.append(dklist)
        operation.append(opr) 
        style_cal.append(style_refer)
        eff_ref_m.append(eff_ref)
        eff.append(eff_emp)
        i=i+1

    ds['OPERATION']=operation
    ds['EFF']=eff
    ds['Style']=style_cal
    ds['Var']=eff_ref_m
    ds['IE']=ie_data
    ds['DK7K']=dk7k
    # ds.to_excel("239_245.xlsx")

cbc1=ds.groupby("OPERATION",as_index=False).agg({"employee":"count","EFF":"mean","work_hs":"sum"})  
# print(mnf)
# print(ds)
i=0
SQ=[]
SAM=[]
OUTPUT=[]
ADD=[]
REC=[]
AFF=[]
w_hr=0
sah_rate=0
NDH=0
mat_hc=[]
while i<len(cbc1):
    OP=str(cbc1.iloc[i,0])
    sql_sam='SELECT sequence,round(earned_hours*180,2) AS sam FROM pr2k.operation_sequence WHERE operation="'+OP+'" AND mfg="'+mnf+'" AND size="'+sizeBOL+'";'
    # sql_eff2='select eff from web_ie_operation2 where week="'+str(week)+'" and groupcbc="'+group+'" and style="'+style_detail+'" and size="'+size+'" and shift="'+shift+'" and operation="'+OP+'" and year(timeupdate)="'+str(year_cbc)+'";'
    # print(sql_sam)
    # dt_eff2=pd.read_sql(sql_eff2,engine_hbi_linebalancing)
    dt_eff2=[]
    engine_hbi_linebalancing.dispose()
    if len(dt_eff2)>0:
        try:
            AFF.append(int(dt_eff2.iloc[0,0]))
        except:
            AFF.append(int(cbc1.iloc[i,2]))
    else:
        AFF.append(int(cbc1.iloc[i,2]))
    dt_sam=pd.read_sql(sql_sam,engine_hbi_linebalancing)
    engine_hbi_linebalancing.dispose()
    sqr=1000
    samr=1
    if len(dt_sam)>0:
        sqr=int(dt_sam.iloc[0,0])
        samr=float(dt_sam.iloc[0,1])
        sah_rate=sah_rate+samr
        w_hr=w_hr+float(cbc1.iloc[i,3])
    if OP=="CASING":
        w_hr=w_hr+float(cbc1.iloc[i,3])
        sah_rate=sah_rate+1
    if OP=="NDH":
        NDH=int(cbc1.iloc[i,1])
    out=round(3*float(cbc1.iloc[i,2])*float(cbc1.iloc[i,3])/samr/100,0)
    mat=int((float(cbc1.iloc[i,1])*442-float(cbc1.iloc[i,3]))/60)
    mat_hc.append(mat)
    ADD.append(0)
    REC.append(0)
    SQ.append(sqr)
    SAM.append(samr)
    OUTPUT.append(out)

    i=i+1
i=0
# while i<len(ds):
#     if ds.iloc[i,6]=="ie_assign":
#         print(ds.iloc[i,0],' ',ds.iloc[i,1],' ',ds.iloc[i,6])
#     i=i+1
cbc1["SQ"]=SQ
cbc1["SAM"]=SAM
cbc1["OUTPUT"]=OUTPUT
cbc1["addq"]=ADD
cbc1["recq"]=REC
cbc1["MAT"]=mat_hc
cbc1["AFF"]=AFF
target=0            #0 operation//1hc//2eff//3work_hrs//4SQ//5sam//6output//7add//8rec//9MAT//10AFF
mi=1000000
ma=1
if w_hr==0:
    w_hr=1

i=0
while i<len(dt_opst):
    dc=0
    if(dt_opst.iloc[i,0]!="MAKE BAND" and dt_opst.iloc[i,0]!="PAD PRINT" and dt_opst.iloc[i,0]!="CLIP THREAD"):
        j=0
        while j<len(cbc1):
            if dt_opst.iloc[i,0]==cbc1.iloc[j,0]:
                dc=1
            j=j+1
    else:
        dc=1
    if dc==0:
        new_row={'OPERATION':dt_opst.iloc[i,0],'employee':0,'EFF':80,'work_hs':0,'SQ':dt_opst.iloc[i,1],'SAM':dt_opst.iloc[i,2],'OUTPUT':0,'addq':0,'recq':0,'MAT':0,'AFF':80}
        cbc1=cbc1.append(new_row, ignore_index=True)
        mi=0
        target=0
    i=i+1





i=0
# cbc2=cbc1.sort_values(by="SQ",ascending=True)
# cbc2=cbc2.reset_index(drop = True)
# print(cbc2)
# print(cbc1)
while i<len(cbc1):
    if cbc1.iloc[i,0]!="NDH" and cbc1.iloc[i,0]!="ie_assign" and cbc1.iloc[i,0]!="CLIP THREAD" and cbc1.iloc[i,0]!="CASING" and cbc1.iloc[i,0]!="PAD PRINT" and cbc1.iloc[i,0]!="MAKE BAND" and cbc1.iloc[i,0]!="PACKING" and cbc1.iloc[i,0]!="MOVER 3" and cbc1.iloc[i,0]!="SEAM WAISTBAND":
        if mi>cbc1.iloc[i,6]:
            mi=cbc1.iloc[i,6]  
        if ma<cbc1.iloc[i,6]:
            ma=cbc1.iloc[i,6]             
    i=i+1

# print(cbc1)
target=mi/ma
# print(" trc _ min ",round(mi,2),' max ',round(ma,2),' rate ',round(target,2))
lp=0
while target<0.98 and lp<400:
    # add and reduce
    i=0
    while i<len(cbc1):
        if cbc1.iloc[i,0]!="NDH" and cbc1.iloc[i,0]!="CLIP THREAD" and cbc1.iloc[i,0]!="ie_assign" and cbc1.iloc[i,0]!="CASING" and cbc1.iloc[i,0]!="PAD PRINT" and cbc1.iloc[i,0]!="MAKE BAND" and cbc1.iloc[i,0]!="PACKING" and cbc1.iloc[i,0]!="MOVER 3" and cbc1.iloc[i,0]!="SEAM WAISTBAND":
            if mi==cbc1.iloc[i,6]:
                cbc1.iloc[i,7]=cbc1.iloc[i,7]+0.02  
                cbc1.iloc[i,6]=3*(float(cbc1.iloc[i,7])*442*cbc1.iloc[i,10]-float(cbc1.iloc[i,8])*442*cbc1.iloc[i,2]+float(cbc1.iloc[i,3])*cbc1.iloc[i,2])/cbc1.iloc[i,5]/100
            else:
                if ma==cbc1.iloc[i,6]:
                    cbc1.iloc[i,8]=cbc1.iloc[i,8]+0.02
                    cbc1.iloc[i,6]=3*(float(cbc1.iloc[i,7])*442*cbc1.iloc[i,10]-float(cbc1.iloc[i,8])*442*cbc1.iloc[i,2]+float(cbc1.iloc[i,3])*cbc1.iloc[i,2])/cbc1.iloc[i,5]/100            
        i=i+1
    # check balance rate
    i=0
    mi=1000000
    ma=1
    while i<len(cbc1):
        if cbc1.iloc[i,0]!="NDH" and cbc1.iloc[i,0]!="CLIP THREAD" and cbc1.iloc[i,0]!="ie_assign" and cbc1.iloc[i,0]!="CASING" and cbc1.iloc[i,0]!="PAD PRINT" and cbc1.iloc[i,0]!="MAKE BAND" and cbc1.iloc[i,0]!="PACKING" and cbc1.iloc[i,0]!="MOVER 3" and cbc1.iloc[i,0]!="SEAM WAISTBAND":
            if mi>cbc1.iloc[i,6]:
                mi=cbc1.iloc[i,6]  
            if ma<cbc1.iloc[i,6]:
                ma=cbc1.iloc[i,6]             
        i=i+1
    target=mi/ma
    lp=lp+1

eff_cbc=round((mi*sah_rate)*100/3/w_hr,2)

#multiskill on wc
m=0
op2=[]
ep2=[]
op3=[]
ep3=[]
while m<len(ds):
    sql_op=('SELECT operation_name,avg_eff,wk_days FROM (SELECT OPERATION_NAME,round(AVG(float_eff),2) AS avg_EFF,COUNT(DATE) AS wk_days '
            +'from bundle_group_by_employee_detail where EMPLOYEE="'+str(ds.iloc[m,0])+'" and workcenter="'+wc+'" AND FLOAT_EFF IS NOT NULL AND FLOAT_EFF<350 AND FLOAT_EFF>30 '
            +'and RATIOOP>=0.3 AND OPERATION_NAME IS NOT NULL group by operation_name) as ttl where wk_days>3 order by wk_days desc;'
            )
    data_detail=pd.read_sql(sql_op,engine_hbi_linebalancing)
    u=0
    if len(data_detail)>0:
        s=0
        while s<len(data_detail):
            if data_detail.iloc[s,0]!=ds.iloc[m,6] and u==0:
                op2.append(data_detail.iloc[s,0])
                ep2.append(data_detail.iloc[s,1])
                u=u+1
            else:
                if data_detail.iloc[s,0]!=ds.iloc[m,6] and u==1:
                    op3.append(data_detail.iloc[s,0])
                    ep3.append(data_detail.iloc[s,1])
                    u=u+1
            s=s+1
        if u==0:
            op2.append('')
            ep2.append('')
            op3.append('')
            ep3.append('') 
        if u==1:
            op3.append('')
            ep3.append('') 

    else:
        op2.append('')
        ep2.append('')
        op3.append('')
        ep3.append('')
    m=m+1

ds["OP2"]=op2
ds["EFF2"]=ep2
ds["OP3"]=op3
ds["EFF3"]=ep3

# i=0
# while i<len(dt_opst):
#     dc=0
#     if(dt_opst.iloc[i,0]!="MAKE BAND" and dt_opst.iloc[i,0]!="PAD PRINT" and dt_opst.iloc[i,0]!="CLIP THREAD"):
#         j=0
#         while j<len(cbc1):
#             if dt_opst.iloc[i,0]==cbc1.iloc[j,0]:
#                 dc=1
#             j=j+1
#     else:
#         dc=1
#     if dc==0:
#         new_row={'OPERATION':dt_opst.iloc[i,0],'employee':0,'EFF':0,'work_hs':0,'SQ':dt_opst.iloc[i,1],'SAM':dt_opst.iloc[i,2],'OUTPUT':0,'addq':0,'recq':0,'MAT':0,'AFF':0}
#         cbc1=cbc1.append(new_row, ignore_index=True)
#         mi=0
#         target=0
#     i=i+1

cbc=cbc1.sort_values(by="SQ",ascending=True)
cbc=cbc.reset_index(drop = True)
t18=0
t18pl=0
t24=0
try:
    i=0
    while i<len(cbc):
        opcbc=str(cbc.iloc[i,0])
        num=cbc.iloc[i,1]
        ado=cbc.iloc[i,7]
        thread=pd.read_sql('select t18,t18poly,t24 from linebalancing.threadst where operation="'+str(opcbc)+'";',engine_hbi_linebalancing)
        if len(thread)>0:
            t18=t18+math.ceil(num+ado)*thread.iloc[0,0]
            t18pl=t18pl+math.ceil(num+ado)*thread.iloc[0,1]      
            t24=t24+math.ceil(num+ado)*thread.iloc[0,2]    
        i=i+1
    t18=math.ceil(t18*1.15)
    t18pl=math.ceil(t18pl*1.15)
    t24=math.ceil(t24*1.15)
except:
    i=0






ds_final=ds.sort_values(by="OPERATION",ascending=True)
ds_final=ds_final.reset_index(drop=True)
kq={'Min':str(round(mi,0)),'Max':str(round(ma,0)),'Rate':str(round(target,2)),'Eff':str(eff_cbc),'Head_Count':str(len(ds_final)-NDH),'NDH':str(NDH),'week':week,'T18':str(t18),'T18PL':str(t18pl),'T24':str(t24)}
abc={'kq_cbc':kq,'ds':ds_final.to_json(orient="records"),'cbc':cbc.to_json(orient="records")}

print(json.dumps(abc))
# print(ds)

# update database

mydb=mysql.connector.connect(
#    host='pbvweb01v',
    host='pbvweb01v',
    user='ngmai1',
    passwd='TomorrowNgoi',
    database="linebalancing"
)

i=0
# operation//hc//eff//work_hrs//SQ//sam//output//add//rec
try:
    week_cbc=int(week_cbc)
except:
    week_cbc=0
if ie_cbc!="" and week_cbc>0 and (ie_cbc=="qudo" or ie_cbc=="Duvan" or ie_cbc=="khle1" or ie_cbc=="phchau1" or ie_cbc=="thle13"  or ie_cbc=="gidoan" or ie_cbc=="ngmai1" or ie_cbc=="trnguye8" or ie_cbc=="netran" or ie_cbc=="tanguye4" or ie_cbc=="conguyen" or ie_cbc=="khle1"):
    # while i<len(cbc):
    #     mat=int((cbc.iloc[i,1]*442-cbc.iloc[i,3])/60)
    #     keyc=str(week)+group+str(cbc.iloc[i,4])+shift+style_detail+size+str(cbc.iloc[i,0])
    #     sql_temp=('replace into operation_ie_balancing_temp (keyc,dateupdate,week,groupline,work_hrs,sq,shift,style,size,operation,sam,hc,mat,eff,reduceq,addq,adde,output,userupdate) '
    #             +'values ("'+keyc+'","'+dx+'","'+str(week)+'","'+group+'","'+str(cbc.iloc[i,3])+'","'+str(cbc.iloc[i,4])+'","'+shift+'","'+style_detail+'","'+size+'","'+str(cbc.iloc[i,0])+'","'+str(cbc.iloc[i,5])+'","'+str(cbc.iloc[i,1])+'","'+str(mat)
    #             +'","'+str(round(cbc.iloc[i,2],2))+'","'+str(round(cbc.iloc[i,8],2))+'","'+str(round(cbc.iloc[i,7],2))+'","'+str(round(cbc.iloc[i,2],2))+'","'+str(cbc.iloc[i,6])+'","'+ie_cbc+'");')
    #     # print(sql_temp)
    #     myCursor=mydb.cursor()
    #     myCursor.execute(sql_temp)
    #     mydb.commit()
    #     i=i+1


    #employee                NAME      line shift namegroup  work_hs   OPERATION     EFF      Style  Var IE
    i=0
    while i<len(ds_final):
        eid=str(ds_final.iloc[i,0])
        nds=ds_final.iloc[i,1]
        shift=ds_final.iloc[i,3]
        group=ds_final.iloc[i,4]
        wh=str(ds_final.iloc[i,5])
        opr=ds_final.iloc[i,6]
        eff=str(round(ds_final.iloc[i,7],2))
        style_refer=ds_final.iloc[i,8]
        var=str(round(ds_final.iloc[i,9],2))
        ie_u=ds_final.iloc[i,10]
        dk7000cl=ds_final.iloc[i,11]
        keye=str(week)+group+shift+style_detail+size+eid
        sql_ds=('replace into employee_eff_data_ie_setup_temp (keye,week,groupline,employee,name,shift,work_hs,style_detail,operation,size,eff,style_refer,var,ieu,iecbc,timeupdate,dk7k) values('
                +'"'+keye+'","'+str(week)+'","'+group+'","'+eid+'","'+nds+'","'+shift+'","'+wh+'","'+style_detail+'","'+opr+'","'+size+'","'+eff+'","'+style_refer+'","'+var+'","'+ie_u+'","'+ie_cbc+'",now(),"'+dk7000cl+'");'
        )
        # print(sql_ds)
        myCursor=mydb.cursor()
        myCursor.execute(sql_ds)
        mydb.commit()
        i=i+1
    i=0
    sh=shift[:1]
    while i<len(cbc):
#0 operation//1hc//2eff//3work_hrs//4SQ//5sam//6output//7add//8rec//9MAT//10AFF
        opr=cbc.iloc[i,0]
        hc=cbc.iloc[i,1]
        eff=cbc.iloc[i,2]
        mat=cbc.iloc[i,9]
        sq=cbc.iloc[i,4]
        sam=cbc.iloc[i,5]
        OUTPUT=cbc.iloc[i,6]
        ad=cbc.iloc[i,7]
        re=cbc.iloc[i,8]
        effi=cbc.iloc[i,10]
        keyc=str(group)+str(week_cbc)+str(shift)+str(style_detail)+str(size)+str(sh)+str(sq)+str(opr[:3])
        sql_i=('replace into linebalancing.web_cbc (keycbc,gr,shift,style,size,week,seq,operation,qty,mat,eff,sam,output,inc_op,eff_inc,dec_op,timeupdate,ie) values ("'+keyc+'","'+str(group)
                +str(sh)+'","'+str(style_detail)+'","'+str(size)+'","'+str(week_cbc)+'","'
                +str(sq)+'","'+str(opr)+'","'+str(hc)+'","'+str(mat)+'","'+str(eff)+'","'+str(sam)+'","'+str(OUTPUT)
                +'","'+str(ad)+'","'+str(effi)+'","'+str(re)+'",now(),"'+str(ie_cbc)+'");'
        )
        # print(sql_i)
        myCursor=mydb.cursor()
        myCursor.execute(sql_i)
        mydb.commit()
        i=i+1


# print('finish')
# print(ds_final)


# print(group)
# print(style_detail)
# print(shift)
# eff_cbc=round((mi*sah_rate)*100/3/w_hr,2)
# print("min ",round(mi,2),' max ',round(ma,2),' rate ',round(target,2),'head count ',len(ds),' eff_cbc = ',eff_cbc)
# print(cbc)
# ds.to_excel('204210B.xlsx')