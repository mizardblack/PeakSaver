import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LinearRegression
import sklearn.metrics as skm
from sklearn.metrics import accuracy_score, precision_score, recall_score
from sklearn import datasets, linear_model, metrics
from datetime import datetime
import requests

# train the model from data and return it
def train_model() -> LinearRegression:
    #reading the CSV file
    df = pd.read_csv('data/utilities.csv')

    # copying the dataset so original stays same
    df_copy = df.copy()

    # dropping columns that are not required
    df_copy= df_copy.drop(['id', 'day','year','thermsPerDay','billingDays','notes','donate'], axis=1)

    # checking correaltion between IV's and DV
    plt.matshow(df_copy.corr())
    plt.show()
    corr = df_copy.corr()

    #making subsets and converting to numpy
    df_x=df_copy[["month", "temp"]].to_numpy()
    df_y=df_copy["elecbill"].to_numpy()
    df_y = df_y.astype(int)

    #train test split
    X_train, X_test, y_train, y_test = train_test_split(df_x, df_y,test_size=0.1, random_state =3)

    #linear regression model
    reg = linear_model.LinearRegression()
    
    # train the model using the training sets
    reg.fit(X_train, y_train)
    
    # regression coefficients
    # ^^^ ???

    return reg

# predict bill using model reg for given month and temp in fahrenheit
def predict_bill(reg: LinearRegression, month: int, temp: int) -> float:
    # month is between 1 and 12
    # temperature in nyc between 14 and 92
    # example x=2(month number) and y=temperature in Fahrenheit
    if month<13 and month>0 and temp<92 and temp>14:
        y_pred = reg.intercept_ + reg.coef_[0]*month + reg.coef_[1]*temp
        
    else:
        print("Incorrect Input")
        
    return y_pred
   
 

def predict_bill_for_current_month(reg) -> float:
    # Get the current month as a number (e.g. January is 1)
    current_month = datetime.now().month

    # getting current temp
    api_key = '<API_KEY>'

    # Set the API endpoint URL
    url = f'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=40.7128&lon=-74.0060'

    # Set up the request headers
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'}

    # Send the API request
    response = requests.get(url, headers=headers, auth=(api_key,''))

    # Extract the temperature data
    data = response.json()
    temperature_c = data['properties']['timeseries'][0]['data']['instant']['details']['air_temperature']
    temperature = temperature_c * 1.8 + 32

    result = predict_bill(reg, current_month, temperature)
    return result
    # result = "{:.2f}".format(result)
    # print("Your expected bill for the month is expected to be $"+ result)


def main():
    reg = train_model()
    temp = predict_bill_for_current_month(reg)
    print("Your expected bill for the month is expected to be ${:.2f}".format(temp))

if __name__ == "__main__":
    main()

