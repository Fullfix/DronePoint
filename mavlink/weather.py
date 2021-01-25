# В переменной r хранится ответ в формате json структура описана тут:
# https://yandex.ru/dev/weather/doc/dg/concepts/forecast-test.html
# Обязательно наличие requests (pip install requests)
def getweather(lat, lon):
    import requests
    r=requests.get("https://api.weather.yandex.ru/v2/forecast?lat="+str(lat)+"&lon="+str(lon), headers={"X-Yandex-API-Key":"ba0a566c-ccb2-4ce5-9bbf-5b6d20acd028"})
    return r.json()["fact"]["temp"]
    # Возвращает: температуру в данной точке. В данный момент.
def goodorbad(lat, lon):
    import requests
    r=requests.get("https://api.weather.yandex.ru/v2/forecast?lat="+str(lat)+"&lon="+str(lon), headers={"X-Yandex-API-Key":"ba0a566c-ccb2-4ce5-9bbf-5b6d20acd028"})
    par = r.json()["fact"]["condition"]
    dictionary = {'clear': 0, 'partly-cloudy': 0, 'cloudy': 0, 'overcast': 0, 'drizzle': 0, 'light-rain': 0, 'rain': 1, 'moderate-rain': 1, 'heavy-rain': 1, 'continuous-heavy-rain': 1, 'showers': 1, 'wet-snow': 1, 'light-snow': 1, 'snow': 2, 'snow-showers': 2, 'hail': 2, 'thunderstorm': 2, 'thunderstorm-with-rain': 2, 'thunderstorm-with-hail': 2}
    # Возвращает: 
    # 0 - OK
    # 1 - So-so
    # 2 - Bad
    return dictionary[par]

def is_weather_ok(place_from, place_to):
    weather1 = getweather(*place_from['pos'])
    weather2 = getweather(*place_from['pos'])
    if weather1 == 0 and weather2 == 0:
        return True
    return False
#print(getweather(43.580439, 39.711042))
#print(goodorbad(43.580439, 39.711042))