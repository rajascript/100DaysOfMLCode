import pandas as pd
import datetime
pd.core.common.is_list_like = pd.api.types.is_list_like
from pandas_datareader import web
import matplotlib.pyplot as plt
from matplotlib import style

style.use('ggplot')

start = datetime.datetime(2010,1,1)
end = datetime.datetime(2015,1,1)

df = web.DataReader("XOM","yahoo",start,end)

printf(df.head())

df['Adj Close'].plot()
plt.show()
