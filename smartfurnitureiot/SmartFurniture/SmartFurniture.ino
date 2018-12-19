const int MAX_PARAMS = 6;
const int MASSAGE_LEN = 4;
const int RIGIDITY_LEN = 3;
const String MASSAGE[MASSAGE_LEN] = {"none","slow","medium","rapid"};
const String RIGIDITY[RIGIDITY_LEN] = {"soft","medium","solid"};

String param = "";
String params[MAX_PARAMS];
int counter = 0;
int start_idx = 0;

void getParams(String data){
  for (int i = 0; i < data.length(); i++) {
    if (data.substring(i, i+1) == ",") {
      params[counter] = data.substring(start_idx, i);
      start_idx = i + 1;
      counter++;
    }
    if (i == data.length() - 1){
      params[counter] = data.substring(start_idx, i + 1);
    }
  }
  counter = 0;
  start_idx = 0;
}
int getIndexByKey(String key, bool is_massage, int len){
  if (is_massage){
    for (int i = 0; i < len; i++){
      if (key.equals(MASSAGE[i])){
        return i;
      }
    }
  }
  else{
    for (int i = 0; i < len; i++){
      if (key.equals(RIGIDITY[i])){
        return i;
      }
    }
  }
  return -1;
}

int getIndexOfMax(int arr[], int len, bool is_massage){
  int idx;
  if (is_massage){
    idx = 0;
  }
  else{
    idx = 1;
  }
  for (int i = 0; i < len; i++){
    if (arr[i] > arr[idx]){
      idx = i;
    }
  }
  return idx;
}

void getDoubleParam(String data, String param_name){
  double res = 0;
  int count = params[0].toInt();
  if (count != 0){
    for (int i = 1; i <= count; i++){
      res += params[i].toDouble();
    }
    res = res/count;
  }
  Serial.print(param_name);
  if (!count){
    Serial.println("-");
  }
  else{
    Serial.println(res);
  }
}

void getStringParam(String arr[], int len, String data, bool is_massage, String param_name){
  int type_counter[len];
  memset(type_counter,0,sizeof(type_counter));
  int count = params[0].toInt();
  for (int i = 1; i <= count; i++){
    type_counter[getIndexByKey(params[i], is_massage, len)]++;
  }
  Serial.print(param_name);
  if (!count){
    Serial.println("-");
  }
  else{
    Serial.println(arr[getIndexOfMax(type_counter, len, is_massage)]);
  }
}

void setup() {
  Serial.begin(115200);
  while (!Serial) {
    ;
  }
}

void loop() {
  while (Serial.available()) {
    param = Serial.readStringUntil('\n');
    if(param.startsWith("height:")){
      String data = param.substring(7);
      getParams(data);
      getDoubleParam(data, "height: ");      
    }
    else if(param.startsWith("length:")){
      String data = param.substring(7);
      getParams(data);
      getDoubleParam(data, "length: ");      
    }
    else if(param.startsWith("width:")){
      String data = param.substring(6);
      getParams(data);
      getDoubleParam(data, "width: ");      
    }
    else if(param.startsWith("incline:")){
      String data = param.substring(8);
      getParams(data);
      getDoubleParam(data, "incline: ");      
    }
    else if(param.startsWith("temperature:")){
      String data = param.substring(12);
      getParams(data);
      getDoubleParam(data, "temperature: ");      
    }
    else if(param.startsWith("massage:")){
      String data = param.substring(8);
      getParams(data);
      getStringParam(MASSAGE, MASSAGE_LEN, data, true, "massage: ");
    }
    else if(param.startsWith("rigidity:")){
      String data = param.substring(9);
      getParams(data);
      getStringParam(RIGIDITY, RIGIDITY_LEN, data, false, "rigidity: ");
    }
    else
      Serial.println(param);
  }
}
