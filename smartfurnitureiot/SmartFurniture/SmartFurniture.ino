#include <ArduinoJson.h>

const int MASSAGE_LEN = 4;
const int RIGIDITY_LEN = 3;
const String MASSAGE[MASSAGE_LEN] = {"none", "slow", "medium", "rapid"};
const String RIGIDITY[RIGIDITY_LEN] = {"medium", "soft", "solid"};

double getDoubleParam(JsonObject &root, String param){
  double res = 0;
  int count = root[param][0];
  if (count != 0){
    for (int i = 1; i <= count; ++i){
      double h = root[param][i];
      res += h;
    }
    res = res/count;
  }
  return res;
}

int getIndexOfMax(int* counterArr, int len){
  int idx;
  for (int i = 0; i < len; ++i){
    if (counterArr[i] > counterArr[idx]){
      idx = i;
    }
  }
  return idx;
}

int getIndexByKey(String key, String* typeArr, int len){
  for (int i = 0; i < len; ++i){
    if (key.equals(typeArr[i])){
      return i;
    }
  }
  return -1;
}

String getStringParam(String* typeArr, int len, JsonObject &root, String param){
  int counterArr[len];
  memset(counterArr, 0, sizeof(counterArr));
  int count = root[param][0];
  for (int i = 1; i <= count; ++i){
    String s = root[param][i];
    ++counterArr[getIndexByKey(s, typeArr, len)];
  }
  return typeArr[getIndexOfMax(counterArr, len)];
}

void setup() {
  Serial.begin(9600);
  while (!Serial) continue;
}

void loop() {
  while(Serial.available()){
    DynamicJsonBuffer jsonBuffer(1024);
    JsonObject& root = jsonBuffer.parseObject(Serial);
    root["height"] = getDoubleParam(root, "height");
    root["length"] = getDoubleParam(root, "length");
    root["width"] = getDoubleParam(root, "width");
    root["incline"] = getDoubleParam(root, "incline");
    if (root.containsKey("temperature")){
      root["temperature"] = getDoubleParam(root, "temperature");
    }
    if (root.containsKey("rigidity")){
      root["rigidity"] = getStringParam(RIGIDITY, RIGIDITY_LEN, root, "rigidity");
    }
    if (root.containsKey("massage")){
      root["massage"] = getStringParam(MASSAGE, MASSAGE_LEN, root, "massage");
    }
    if (root.containsKey("name")){
      root.printTo(Serial);
      Serial.println();
    }
  }
}
