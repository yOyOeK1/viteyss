import pandas as pd


tStart = 0
tEnd = 0
tHz = 115200.00*1.00
dB = 1e6
tStep = 1.0/tHz


# Load the data with ':' as the delimiter. The file has no header.
df = pd.read_csv('/tmp/la.csv', sep=':', header=None, names=['time', 'ch1'])


for i in df.iloc:
    if tStart == 0:
        tStart = i[0] 
    tEnd = i[0]

df['time_s'] = ( df['time'] - tStart  ) / dB

# Convert the time values from nanoseconds (the likely unit) to seconds
df.sep = ","

print(df)


lIndex = 0
lItemSet = False
fillT = []
tTotal = (tEnd - tStart) / dB
print( f"fill total: {tTotal} step: {tStep} at {tHz}Hz" )
print(f"fill 0 to {tTotal}" )
i=0
tS = 0.00
while tS <= tTotal:
    if lIndex > len(df)-3:
        break
    tE = tS+(tStep)
    #print( f"tik: {tik} ts:{tS}\nts end \n df:{df}\n df end\n " )
    #print(f"df[0]\n{df.iloc[0]}" )
    if lItemSet == False:
        lItem = df.iloc[lIndex]
        lItemNext = df.iloc[lIndex+1]
        lItemSet = True
    
    #print( f"lItem: \n{lItem}\nlItem end\n" )
    #print( f"tik: {i} \n\tindex:{lIndex}  ts:{tS} te {tE} \n item:{lItem['time_s']}  itemNext:{lItemNext['time_s']}\n\n " )

    fillT.append( {'time': tS, 'ch1':int(lItem['ch1']) } )
    
    if tE >= lItemNext['time_s']:
        print("swap item point")
        lIndex+= 1
        lItem = df.iloc[lIndex]
        lItemNext = df.iloc[lIndex+1]


    #if i > 170:
    #    exit(3 )

    i+=1
    tS+= tStep

#print(f" fill now is long {len(fillT)}")


# Save the processed data to a new CSV file
#df[['time_s', 'ch1']].to_csv('/tmp/la5Fix.csv', index=False)

s = pd.DataFrame( fillT)
#print(s)

s.to_csv('/tmp/la5Fill.csv', index=False, sep=',')


#print("Conversion complete! The file 'sigrok_data.csv' has been created.")