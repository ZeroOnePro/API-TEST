curl --request GET \
  --url 'https://web-production.lime.bike/api/rider/v1/login?phone=%2B821036231771'

read -p "enter login code >> " code

login_params="{\"login_code\":\"$code\",\"phone\":\"+821036231771\"}"

echo $login_params

curl --request POST \
  --cookie-jar - \
  --url 'https://web-production.lime.bike/api/rider/v1/login' \
  --header 'Content-Type: application/json' \
  --data $login_params

read -p "enter token >> " token
read -p "enter cookie >> " cookie

curl --request GET \
  --url 'https://web-production.lime.bike/api/rider/v1/views/map?ne_lat=52.6&ne_lng=13.5&sw_lat=52.4&sw_lng=13.3&user_latitude=52.5311&user_longitude=13.3849&zoom=16' \
  --header 'authorization: Bearer '$token \
  --cookie '_limebike-web_session='$cookie 

