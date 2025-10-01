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
    database="cutting_system"
)
pd.set_option("display.precision", 2)
engine_hbi_linebalancing = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/linebalancing', echo=False)
engine_hbi_pr2k = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/pr2k', echo=False)
engine_cutting = create_engine('mysql+mysqlconnector://ngmai1:TomorrowNgoi@pbvweb01v:3306/cutting_system', echo=False)
#hostname='127.0.0.1'
filename='D:\\HanesApp94\\Hanes_app_web\\LineBalancing\\public\\save\\'+sys.argv[1]
ie=sys.argv[2]
data_up=pd.read_excel(filename)
thisTime=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
i=0
try:
    while i<len(data_up):
        cutlot=data_up.iloc[i,0]
        plan_dz=int(data_up.iloc[i,6])
        cut=float(data_up.iloc[i,7])
        bdl=float(data_up.iloc[i,8])
        spr=float(data_up.iloc[i,9])
        bis=float(data_up.iloc[i,10])
        sts=float(data_up.iloc[i,11])
        mhl=float(data_up.iloc[i,12])
        cas=float(data_up.iloc[i,13])
        cte=float(data_up.iloc[i,14])
        pre=float(data_up.iloc[i,15])
        brb=float(data_up.iloc[i,16])
        mov=float(data_up.iloc[i,17])
        cu2=float(data_up.iloc[i,18])
        bd2=float(data_up.iloc[i,19])
        sp2=float(data_up.iloc[i,20])
        mh2=float(data_up.iloc[i,21])
        ca2=float(data_up.iloc[i,22])
        #CUT
        if cut>0:
            sah_adj_dz=round(cut/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="CUT";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+str(tem)+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #BDL
        if bdl>0:
            sah_adj_dz=round(bdl/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="BDL";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,4)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #SPR
        if spr>0:
            sah_adj_dz=round(spr/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="SPR";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #bis
        if bis>0:
            sah_adj_dz=round(bis/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="BIS";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #sts
        if sts>0:
            sah_adj_dz=round(sts/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="STS";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #mhl
        if mhl>0:
            sah_adj_dz=round(mhl/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="MHL";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #cas
        if cas>0:
            sah_adj_dz=round(cas/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="CAS";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #cte
        if cte>0:
            sah_adj_dz=round(cte/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="CTE";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #pre
        if pre>0:
            sah_adj_dz=round(pre/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="PRE";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #BRB
        if brb>0:
            sah_adj_dz=round(brb/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="BRB";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #MOV
        if mov>0:
            sah_adj_dz=round(mov/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="MOV";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #CU2
        if cu2>0:
            sah_adj_dz=round(cu2/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="CU2";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #BD2
        if bd2>0:
            sah_adj_dz=round(bd2/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="BD2";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #sp2
        if sp2>0:
            sah_adj_dz=round(sp2/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="SP2";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1   
        #MH2
        if mh2>0:
            sah_adj_dz=round(mh2/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="MH2";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1
        #ca2
        if ca2>0:
            sah_adj_dz=round(ca2/plan_dz/60,6)
            tem_qr=pd.read_sql('select ticket,units from bundleticket_active where work_lot="'+str(cutlot)+'" and operation_code="CA2";',engine_cutting)
            j=0
            if len(tem_qr)>0:
                    while j<len(tem_qr):
                        sah_add=round(sah_adj_dz*tem_qr.iloc[j,1]/12,3)
                        tem=str(tem_qr.iloc[j,0])
                        sql_up='update bundleticket_active set SAH_ADJ="'+str(sah_add)+'",IE_ADJ="'+ie+'",DATE_ADJ="'+thisTime+'" WHERE TICKET="'+tem+'";'
                        myCursor=mydb.cursor()
                        myCursor.execute(sql_up)
                        mydb.commit()
                        j=j+1

        i=i+1

    print(data_up.to_json(orient="records"))
    # print(ie+' update '+str(len(data_up))+'dong du lieu')
except:
    abc={'week':"error",'EMPLOYEE':'error'}
    print(json.dumps(abc))
# os.remove(filename)