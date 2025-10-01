import sys, json
import os
import mysql.connector
import string
import pandas as pd
from sqlalchemy import create_engine
#import random
import datetime
import numpy as np
engine_hbi_linebalancing = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
engine_hbi_pr2k = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/pr2k', echo=False)
engine_hbi_erpsystem = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/erpsystem', echo=False)
group=sys.argv[1]
shift=sys.argv[3]
week_cbc=int(sys.argv[2])
con_m=int(sys.argv[4])
testdate=datetime.datetime.today()
if week_cbc==0:
    week_cbc=testdate.isocalendar()[1]
# group="204-210"
# shift="RIT"
# style_detail="BX Normal"
# week_cbc="36"
# sql_wc=pd.read_sql('select workcenter from aci_data where workcenter is not null and style_detail="'+style_detail+'";',engine_hbi_linebalancing)
# wc=str(sql_wc.iloc[0,0])
sql_list='select employee,name from employee_eff_data_ie_setup_temp where groupline="'+group+'" and shift like "'+shift+'%" and week="'+str(week_cbc)+'" group by employee;'
emp=pd.read_sql(sql_list,engine_hbi_linebalancing)
engine_hbi_linebalancing.dispose()
# print(sql_list)
# print(wc)
# print(emp)
if con_m==1:
    i=0
    #print(emp.iloc[1,0])
    employee=[]
    name=[]
    OPERATION=[]
    AVG_EFF=[]
    WK_DAY=[]
    CD=[]
    while i<len(emp):
        sql_op=('SELECT operation_name,avg_eff,wk_days FROM (SELECT OPERATION_NAME,round(AVG(float_eff),2) AS avg_EFF,COUNT(DATE) AS wk_days '
                +'from bundle_group_by_employee_detail where EMPLOYEE="'+str(emp.iloc[i,0])+'" AND FLOAT_EFF IS NOT NULL AND FLOAT_EFF<350 AND FLOAT_EFF>30 '
                +'and RATIOOP>=0.3 AND OPERATION_NAME IS NOT NULL group by operation_name) as ttl order by wk_days desc;'
                )
        data_detail=pd.read_sql(sql_op,engine_hbi_linebalancing)
        engine_hbi_linebalancing.dispose()
        j=0
        while j<len(data_detail) and j<3:
            employee.append(str(emp.iloc[i,0]))
            name.append(str(emp.iloc[i,1]))
            OPERATION.append(data_detail.iloc[j,0])
            AVG_EFF.append(data_detail.iloc[j,1])
            WK_DAY.append(data_detail.iloc[j,2])
            CD.append(j+1)
            j=j+1
        # print(sql_op)
        # print(data_detail)    
        i=i+1
    jsdata={"EMPLOYEE":employee,"NAME":name,"OPERATION":OPERATION,"AVG_EFF":AVG_EFF,"WK_DAY":WK_DAY,"CD":CD}
    multiskill=pd.DataFrame(jsdata)
    i=0
    employee=[]
    name=[]
    op1=[]
    op2=[]
    op3=[]
    eff1=[]
    eff2=[]
    eff3=[]
    wk1=[]
    wk2=[]
    wk3=[]
    while i<len(multiskill):
        if multiskill.iloc[i,5]==1:
            employee.append(multiskill.iloc[i,0])
            name.append(multiskill.iloc[i,1])
            op1.append(multiskill.iloc[i,2])
            eff1.append(multiskill.iloc[i,3])
            wk1.append(multiskill.iloc[i,4])
            j=0
        try:
            if multiskill.iloc[i+1,5]==2:
                op2.append(multiskill.iloc[i+1,2])
                eff2.append(multiskill.iloc[i+1,3])
                wk2.append(multiskill.iloc[i+1,4])
                j=1
            else:
                op2.append('')
                eff2.append('')
                wk2.append('')
        except:
            op2.append('')
            eff2.append('')
            wk2.append('')
        try:
            if multiskill.iloc[i+2,5]==3:
                op3.append(multiskill.iloc[i+2,2])
                eff3.append(multiskill.iloc[i+2,3])
                wk3.append(multiskill.iloc[i+2,4])
                j=2
            else:
                op3.append('')
                eff3.append('')
                wk3.append('')
        except:
            op3.append('')
            eff3.append('')
            wk3.append('')
        i=i+1+j
    jsdata={"employee":employee,"name":name,"op1":op1,"eff1":eff1,"wk1":wk1,"op2":op2,"eff2":eff2,"wk2":wk2,"op3":op3,"eff3":eff3,"wk3":wk3}
    multiskill=pd.DataFrame(jsdata)
    print(multiskill.to_json(orient="records"))
else:
    i=0
    employee=[]
    name=[]
    op1=[]
    op2=[]
    op3=[]
    eff1=[]
    eff2=[]
    eff3=[]
    wk1=[]
    wk2=[]
    wk3=[]
    while i<len(emp):
        sql_mul='select employee,operation,bundle from (select employee,operation,count(ticket) as bundle from employee_scanticket where employee="'+str(emp.iloc[i,0])+'" and date>"20200701" and operation is not null group by operation) as tab where bundle>6 order by bundle desc;'
        data_mul=pd.read_sql(sql_mul,engine_hbi_pr2k)
        engine_hbi_pr2k.dispose()
        m=0
        while m<len(data_mul):
            employee.append(data_mul.iloc[m,0])
            name.append(emp.iloc[i,1])
            op1.append(data_mul.iloc[m,1])
            op2.append('')
            op3.append('')
            eff1.append('')
            eff2.append('')
            eff3.append('')
            wk1.append(data_mul.iloc[m,2])
            wk2.append('')
            wk3.append('')
            m=m+1
        i=i+1
    jsdata={"employee":employee,"name":name,"op1":op1,"eff1":eff1,"wk1":wk1,"op2":op2,"eff2":eff2,"wk2":wk2,"op3":op3,"eff3":eff3,"wk3":wk3}
    multiskill=pd.DataFrame(jsdata)
    print(multiskill.to_json(orient="records"))


