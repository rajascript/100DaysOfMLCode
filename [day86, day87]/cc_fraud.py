import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns


data = pd.read_csv('creditcard.csv')

print(data.head(500))


data.hist(figsize = (20, 20))
plt.show()