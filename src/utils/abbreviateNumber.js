function abbreviateNumber(value) {
    let newValue = value;
    const suffixes = ["", "K", "M", "B","T"];
    let suffixNum = 0;
   
    while (newValue >= 1000) {
      newValue /= 1000;
      suffixNum++;
    }    

    if (value < 100) newValue = Math.round(newValue);
    else newValue = newValue.toPrecision(3);

    newValue += suffixes[suffixNum];
    return newValue;
}

export {
    abbreviateNumber  
}