/*  yadbutils.js: Utilities */
function numForm(num,encero,sepmil,sepdec) {
	if (sepmil==null) sepmil=',';
	if (!sepdec) sepdec='.';
  if (!encero) encero="0.00";
  if (num==null) num=0;
  if (isNaN(num)) num=0;
  num = num.toString().replace(/\$|\,/g,'');
  if ((isNaN(num)) || (num==0)) return encero;
  sign = (num == (num = Math.abs(num)));
  num = Math.floor(num*100+0.50000000001);
  cents = num%100;
  num = Math.floor(num/100).toString();
  if(cents<10)
     cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
     num = num.substring(0,num.length-(4*i+3))+sepmil+num.substring(num.length-(4*i+3));
  return (((sign)?'':'-') + num + sepdec + cents);
}
function myFl(num,divisor,cuantos) {
  if (!divisor) divisor=1000;
  if (!cuantos) cuantos=3;
  if (isNaN(num)) return 0;
  var n=Math.floor((num*divisor)+0.5)/divisor;
  return n.toFixed(cuantos)*1;
}
function sumarNeto (neto){
	neto = neto.replace(/-/g,"+-");
	arrNeto = neto.split('+');
	newNeto = 0;
	for (i=0;i<arrNeto.length;i++){
    if (arrNeto[i].length) newNeto += parseFloat (arrNeto[i]);
    if (isNaN(newNeto)) newNeto=0;
	}
	return newNeto;
}
