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
    user='tranmung',
    passwd='Tr6nM6ng',
    database="mms"
)

pd.set_option("display.precision", 2)
engine_hbi_linebalancing = create_engine('mysql+mysqlconnector://tranmung:Tr6nM6ng@pbvweb01v:3306/linebalancing', echo=False)
engine_hbi_pr2k = create_engine('mysql+mysqlconnector://tranmung:Tr6nM6ng@pbvweb01v:3306/pr2k', echo=False)
engine_hbi_erpsystem = create_engine('mysql+mysqlconnector://tranmung:Tr6nM6ng@pbvweb01v:3306/erpsystem', echo=False)
#hostname='127.0.0.1'
# print(sys.argv[1],sys.argv[2])
filename='D:\\HanesApp94\\Hanes_app_web\\public\\AM\\'+sys.argv[1]
# print(filename)
# filename='C:\\CMMS\\public\\AM\\\\ngmai1_2022-3-10.xlsx'
mc=pd.read_excel(filename)
# print(mc)
# d_end=datetime.date(2020,8,12)
dup=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
user=sys.argv[2]
# user="ngoi"
myCursor=mydb.cursor()
try:
# if 1>0:
    i=0
    while i<len(mc):
        vl=''
        for j in range(0,18):
            vl+='"'+str(mc.iloc[i,j])+'",'
        vl+='"'+dup+'","'+str(user)+'"'
        # asset=mc.iloc[i,0]
        # compa=mc.iloc[i,1]
        # lawas=mc.iloc[i,2]
        # locna=mc.iloc[i,3]
        # lawlo=mc.iloc[i,4]
        # itemq=mc.iloc[i,5]
        # divis=mc.iloc[i,6]
        # acctu=mc.iloc[i,7]
        # insrv=mc.iloc[i,8]
        # seria=mc.iloc[i,9]
        # life=mc.iloc[i,10]
        # lifer=mc.iloc[i,11]
        # model=mc.iloc[i,12]
        # tagnu=mc.iloc[i,13]
        # cr_da=mc.iloc[i,14]
        # cost=mc.iloc[i,15]
        # net=mc.iloc[i,16]
        # curr=mc.iloc[i,17]
        # status=mc.iloc[i,18]
        # inuse=mc.iloc[i,19]
        sql='replace into am_inventory values ('+vl+');'
        # print(sql)
        myCursor.execute(sql)
        mydb.commit()
        i=i+1
    mydb.close()
    sc="system has imported row "+str(i)
    print(sc)
    # mc.columns=['a1','a2','a3','a4','a5','a6','a7','a8','a9','a10','a11','a12','a13','a14','a15','a16','a17','a18','a19','a20']
    # abc={'list':mc.to_json(orient="records")}
    # print(json.dumps(abc))
except:
    er="data error at row "+str(i)
    print(er)

#print("done")