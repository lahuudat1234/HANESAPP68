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
#hostname='127.0.0.1'
filename='D:\\HanesApp94\\Hanes_app_web\\public\\save\\'+'211-217.xlsx'
ie='Duvan'
if os.path.exists(filename):
    data_up=pd.read_excel(filename)
    i=0
    try:
        week=data_up.iloc[i,0]
        EMPLOYEE=data_up.iloc[i,2]
        work_hs=data_up.iloc[i,5]
        EFF=data_up.iloc[i,9]
        try:
            var=data_up.iloc[i,11]
        except:
            var='0'
        a=int(week)
        a=int(EMPLOYEE)
        a=int(EFF)
        data_up=data_up.fillna(0)
        while i<len(data_up):
            week=str(int(data_up.iloc[i,0]))
            groupline=data_up.iloc[i,1]
            EM="00"+str(int(data_up.iloc[i,2]))
            EMPLOYEE=EM[-5:]
            name=data_up.iloc[i,3]
            shift=data_up.iloc[i,4]
            work_hs=data_up.iloc[i,5]
            STYLE_DETAIL=data_up.iloc[i,6]
            OPERATION=data_up.iloc[i,7]
            SIZE=data_up.iloc[i,8]
            EFF=data_up.iloc[i,9]
            style_refer=data_up.iloc[i,10]
            try:
                var=str(data_up.iloc[i,11])
            except:
                var='0'
            ieu=ie
            iecbc=ie
            key=str(week)+str(groupline)+shift+str(STYLE_DETAIL)+SIZE+str(EMPLOYEE)
            sql_ds=('replace into linebalancing.employee_eff_data_ie_setup_temp(keye,week,groupline,employee,name,shift,work_hs,style_detail,operation,size,eff,style_refer,ieu,iecbc,timeupdate,var) values('
                    +'"'+key+'","'+str(week)+'","'+str(groupline)+'","'+str(EMPLOYEE)+'","'+name+'","'+shift+'","'+str(work_hs)+'","'+str(STYLE_DETAIL)+'","'+OPERATION+'","'+SIZE+'","'+str(EFF)+'","'+str(style_refer)+'","'+iecbc+'","'+iecbc+'",now(),"'+var+'");')
            # print(sql_ds)
            myCursor=mydb.cursor()
            myCursor.execute(sql_ds)
            mydb.commit()
            i=i+1

        # abc={'kq_cbc':kq,'ds':ds_final.to_json(orient="records"),'cbc':cbc.to_json(orient="records")}

        print(data_up.to_json(orient="records"))
        # print(ie+' update '+str(len(data_up))+'dong du lieu')
    except Exception as e:
        # print(e)
        abc={'week':"error",'EMPLOYEE':'error'}
        print(json.dumps(abc))
    # try:
    #     os.remove(filename)
    # except:
    #     a=0