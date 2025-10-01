import math

import sys

import os

import time

import pandas as pd

import string

import getpass

import mysql.connector

from datetime import datetime

from sqlalchemy import create_engine

import datetime

import numpy as np

engine_hbi = create_engine('mysql+mysqlconnector://tranmung:Tr6nM6ng@pbvweb01v:3306/qco', echo=False)

mydb=mysql.connector.connect(host="pbvweb01v", user='tranmung', passwd='Tr6nM6ng', database="qco")

myCursor=mydb.cursor()

ds=[]

import glob
import os

# print (latest_file)
filename='D:\\HanesApp94\\Hanes_app_web\\public\\CS\\'+sys.argv[1]
ds=pd.read_excel(filename)
import re
num = filename[len(filename)-7:len(filename)-5]
# print (num) 
i=0

while i<len(ds):

      groupcs= ds.iloc[i,0]
      selling1= ds.iloc[i,1]
      selling2= ds.iloc[i,2]
      distribute= ds.iloc[i,3]
      transfer_time= ds.iloc[i,4]
      quality_remark=ds.iloc[i,5]
      leader= ds.iloc[i,6]
      user=""

      if str(groupcs)=='nan' : groupcs=""
      if str(selling1)=='nan' : selling1=""
      if str(selling2)=='nan' : selling2=""
      if str(distribute)=='nan' : distribute= ""
      if str(transfer_time)=='nan' : transfer_time=""
      if str(leader)=='nan' : leader=""
      if str(quality_remark)=='nan' : quality_remark= ""

      # group=[groupcs,selling1,selling2,distribute,transfer_time,leader]
      # for j in range(0,5):
      #       if str(group[j])== 'nan': group[j]=""          


      sql_up=('SELECT COUNT(style1) FROM changestyle_group WHERE keyindex="'+str(groupcs)+str(transfer_time)+'";')
      myCursor.execute(sql_up)
      myresult = myCursor.fetchall()
      # print(myresult[0])
      if str(myresult[0])=='(0,)':
            sql_up1=('insert into qco.changestyle_group  (id,keyindex, group_cs, style1, style2, section, c_time,quality_remark, leader,user_edit,timeupdate) values ("'+str(num)+'","'+str(groupcs)+str(transfer_time)+'","'+str(groupcs)+'","'+str(selling1)+'","'+str(selling2)+'","'+str(distribute)+'","'+str(transfer_time)+'","'+str(quality_remark)+'","'+str(leader)+'","'+str(user)+'",now());')
      else:
            sql_up1='update changestyle_group set user_edit="'+str(user)+'",style1="'+str(selling1)+'",style2="'+str(selling2)+'",section="'+str(distribute)+'",leader="'+str(leader)+'",id="'+str(num)+'",quality_remark="'+str(quality_remark)+'",timeupdate=now() where keyindex="'+str(groupcs)+str(transfer_time)+'";'

      myCursor.execute(sql_up1)
      mydb.commit()

      i=i+1

print("finish")
