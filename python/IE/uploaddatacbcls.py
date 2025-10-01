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
filename='D:\\HanesApp94\\Hanes_app_web\\LineBalancing\\public\\save\\'+sys.argv[1]
ie=sys.argv[2]
if os.path.exists(filename):
    data_up=pd.read_excel(filename)
    date_cal=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    i=0
    try:
        week=data_up.iloc[i,0]
        EMPLOYEE=data_up.iloc[i,2]
        work_hrs=data_up.iloc[i,5]
        var=0
        a=int(week)
        a=int(EMPLOYEE)
        while i<len(data_up):
            week=str(int(data_up.iloc[i,0]))
            groupline=data_up.iloc[i,1]
            EM="00"+str(int(data_up.iloc[i,2]))
            EMPLOYEE=EM[-5:]
            name=data_up.iloc[i,3]
            shift=data_up.iloc[i,4]
            work_hrs=data_up.iloc[i,5]
            ieu=ie
            iecbc=ie
            key=str(week)+EMPLOYEE
            sql_ds=('replace into setup_emplist_ls (keyid,id,name,line,shift,week,Line_new,shift_new,work_hrs,ML,dateupdate,userupdate) values('
                    +'"'+key+'","'+EMPLOYEE+'","'+name+'","'+groupline+'","'+shift+'","'+str(week)+'","'+groupline+'","'+shift+'","'+str(work_hrs)+'","","'+date_cal+'","'+iecbc+'");'
            )
            # print(sql_ds)
            myCursor=mydb.cursor()
            myCursor.execute(sql_ds)
            mydb.commit()
            i=i+1

        # abc={'kq_cbc':kq,'ds':ds_final.to_json(orient="records"),'cbc':cbc.to_json(orient="records")}

        print(data_up.to_json(orient="records"))
    # print(ie+' update '+str(len(data_up))+'dong du lieu')
    except:
        abc={'week':"error",'EMPLOYEE':'error'}
        print(json.dumps(abc))
    try:
        os.remove(filename)
    except:
        a=0