function getMessage(a, b){
  if (typeof(a) == "boolean") {
    if (a === true) {
      return "Переданное GIF-изображение анимировано и содержит " + b + " кадров";
    }
    else {
      return "Переданное GIF-изображение не анимировано";
    }
  };
  if (typeof(a) === "number") {
    return "Переданное SVG-изображение содержит " + a + " объектов и " + (b * 4) + " атрибутов";
  };
  if (Array.isArray(a)) {
    var sum = a;
    for (i = 0; i < a.lenght; i++) {
      sum += a[i];
    }
    return "Количество красных точек во всех строчках изображения: " + sum;
  };
  if (Array.isArray(a) && Array.isArray(b)) {
    return "Общая площадь артефактов сжатия: " + ((a+b)*(a+b)) + " пикселей";
  };
};

getMessage();