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
    database="cutting_system"
)
pd.set_option("display.precision", 2)
engine_hbi_linebalancing = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
engine_hbi_pr2k = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/pr2k', echo=False)
engine_hbi_erpsystem = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/erpsystem', echo=False)
#hostname='127.0.0.1'
filename='D:\\HanesApp94\\Hanes_app_web\\LineBalancing\\public\\save\\'+sys.argv[1]
ie=sys.argv[2]
data_up=pd.read_excel(filename)
data_up['OP_TRAN2'].replace(to_replace = [None], value ="",inplace=True)
data_up['OP_TRAN3'].replace(to_replace = [None], value ="",inplace=True)
data_up['OP_TRAN4'].replace(to_replace = [None], value ="",inplace=True)
data_up['NOTE'].replace(to_replace = [None], value ="",inplace=True)
i=0
try:
    idnv=data_up.iloc[i,0]
    week=data_up.iloc[i,9]
    a=int(idnv)
    a=int(week)
    while i<len(data_up):
        week=str(int(data_up.iloc[i,9]))
        EM="00"+str(int(data_up.iloc[i,0]))
        EMPLOYEE=EM[-6:]
        ten=str(data_up.iloc[i,1])
        NAMEGROUP=str(data_up.iloc[i,2])
        offcode=str(data_up.iloc[i,3])
        op_reg=str(data_up.iloc[i,4])
        op_tran1=str(data_up.iloc[i,5])
        op_tran2=str(data_up.iloc[i,6])
        op_tran3=str(data_up.iloc[i,7])
        op_tran4=str(data_up.iloc[i,8])
        reason=str(data_up.iloc[i,10])
        note=str(data_up.iloc[i,11])
        ieu=""
        ieup=ie
        key=str(week)+EMPLOYEE+offcode
        sql_ds=('replace into offstandard_employee_registed (idnweekcode,id,name,namegroup,offcode,op_reg,op_tran1,op_tran2,op_tran3,op_tran4,week_reg,reason,note,user_reg) values ('
                +'"'+key+'","'+str(EMPLOYEE)+'","'+ten+'","'+NAMEGROUP+'","'+offcode+'","'+op_reg+'","'+op_tran1+'","'+str(op_tran2)+'","'+op_tran3+'","'+op_tran4+'","'+week+'","'+str(reason)+'","'+note+'","'+ieup+'");'
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
os.remove(filename)