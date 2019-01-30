var i = parseInt((5 * 7 * 9) / 11);
while (i) {
  if (i % (5*7*9)) {
    var a = i * 11;
    if (((a + 1) % (5 * 7 * 9)) == 0){
      console.log(a);
      break;
    }
  }
  i++;
}
