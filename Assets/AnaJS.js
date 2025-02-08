  //Oyun sürümü
  let OyunTamSurumu = "1.2.0";
  let OyunSurumuBasamak1 = 1;//Oyun tam çıkmışsa 1 yapılacak
  let OyunSurumuBasamak2 = 0;//Oyunun büyük güncellemelerinde 1 arttırılacak
  let OyunSurumuBasamak3 = 1;//Oyunun küçük güncellemelerinde 1 arttırılacak

  //Soru değişkenleri
  let Number1;
  let Number2;
  let cevap;

  let beklemek = true;

  //Puan değişkenleri
  let dogruSayisi = 0;
  let yanlisSayisi = 0;
  let puan = 0; // Varsayılan puan
  let SoruPuanKatsayisi = 0; //Soru katsayısı

  //Oyun ayarları
  let timerInterval; // Zamanlayıcı
  let sure = 30; // Varsayılan süre
  let secilenIslemler = ["toplama"]; // Varsayılan işlemler
  let zorluk = "kolay"; // Varsayılan zorluk
  let zorlukKatsayisi = 1; // Zorluk katsayısı

  //Oyun sonunda yazılacak paragraflar
  let Paragraflar = []; //Oyun sonunda yazacak paragrafları belirler

  //Geçmiş menüsündeki paragraflar
  let Paragraflar2 = [];
  
  //Enter tuşuna basıldığında cevaplamak için
  let handleKeyDown; // Global değişken olarak tanımlandı.

  //Oyunda hangi soruları yapmışız onların geçmişini gösterir
  let Sorular = []; //tüm soruları tutar
  let Soru = {}; //tek bir soruyu tutar

  //Geçmiş değişkenleri
  let AllHistory = []; //Tüm geçmişi tutar
  let Historyy = {}; //Tek bir geçmişi tutar


  //Tüm geçmişi al
  if (localStorage.getItem("AllHistory")) {
    //Siteye girdiğinde geçmişi alsın

    AllHistory = JSON.parse(localStorage.getItem("AllHistory"));
  }
  
//Tanımlanması gereken fonksiyonlar

//Rastgele sayı üretme fonksiyonu
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//İçeriği değiştirme fonksiyonu
function innerHTML(girdi, girilen) {
  document.getElementById(girdi).innerHTML = girilen;
}

function resetle(){
  //Oyunu sıfırlamadan önce emin misiniz? sorusu sor ve 3 saniye sonra eminim butonuna basarsa sıfırla
  //emin değilse sıfırlama
  
  //1 soru paragrafı yaz soruda şu yazsın : Tüm geçmişinizi silmek istediğinize emin misiniz? 2 buton ekle 1.si evet 2.si hayır 3 saniye boyunca evet butonu kitli basılamaz bir şekilde. 3 saniye sonra evet butonuna basılırsa tüm geçmişi sil.

  ToggleOperation(document.getElementById("Eminmisin"), "close");

  innerHTML("SoruE", "Tüm geçmişinizi silmek istediğinize emin misiniz?");

  document.getElementById("SoruButon").onclick = function(){
    localStorage.removeItem("AllHistory");
    AllHistory = [];
    innerHTML("SoruE", "Tüm geçmişiniz silindi");
  };
}

//Menüye gitme fonksiyonu
function GoToFunction(Open){

  setTimeout(function () {
    const elements = document.getElementsByClassName("Menus");

    // Döngüyle elemanlara erişme
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add("close");

    }

    document.getElementById(Open).classList.remove("close");

  }, 100);

  
}

//İşlem seçme butonları ve class eklemek
function ToggleOperation(Element,ClassNName) {
    
  if (Element.classList.contains(ClassNName)) {
    Element.classList.remove(ClassNName);
  } else {
    Element.classList.add(ClassNName);
  }
}

function ApplySettings() {
  // Süre ayarını al
  let sureInput = document.getElementById("sureInput").value;
  sure = parseInt(sureInput);
  sure2 = sure

  if (isNaN(sure) || sure < 5 || sure > 120) {
    innerHTML('Uyar',"Süre 5 ile 120 saniye arasında olmalıdır.");
    return;
  }

  // İşlem ayarlarını al
  secilenIslemler = [];
  
  let islemler = document.querySelectorAll(".islemButton");
  
  for(let i = 0; i < secilenIslemler.length; i++){
    if (islemler[i].classList.contains("selected")) {
      
      secilenIslemler.push(buton.id);
    }
  }
  
  islemler.forEach(function(buton) {
    
    if (buton.classList.contains("selected")) {
      secilenIslemler.push(buton.id);
    }
  });

  if (secilenIslemler.length === 0) {
    innerHTML('Uyar',"En az bir işlem seçmelisiniz.");

    setTimeout(function () {
      innerHTML('Uyar',"");
    }, 2000);
    return;
  }

  // Zorluk ayarını al
  
  let zorlukSecimi = document.querySelector('input[name="zorluk"]:checked');
  
  if (zorlukSecimi) {
    zorluk = zorlukSecimi.value;
    if (zorluk === "kolay") zorlukKatsayisi = 1;
    else if (zorluk === "orta") zorlukKatsayisi = 3;
    else if (zorluk === "zor") zorlukKatsayisi = 5;
  }
  
  StartGame();
}

function StartGame() {
  let secilenIslemlernew = [...secilenIslemler]; //aynı işlemi tekrar yapmamak için
  dogruSayisi = 0;
  yanlisSayisi = 0;
  SoruPuanKatsayisi = 0;
  puan = 0;
  Sorular = [];
  
  innerHTML("dogruSayisi", "Doğru: " + dogruSayisi);
  innerHTML("yanlisSayisi", "Yanlış: " + yanlisSayisi);
  innerHTML("puan", "Puan: " + puan);

  GoToFunction("Game");
  
  //Süre geri sayımı !!
  timerInterval = setInterval(function () {
    sure--;
    innerHTML("Sure", "Kalan Süre: " + sure + " saniye");

    if (sure <= 0) {

      Sorular.push(Soru);
      
      EndGame();
    }
  }, 1000);

  soru(secilenIslemlernew);
}

function soru(secilenIslemlernew) {

  document.getElementById("SoruInput").value = "";

  // Eğer seçilen işlemler bitti ise tekrar başa dön
  if (secilenIslemlernew.length === 0) {
    secilenIslemlernew = [...secilenIslemler];
  }

  
  let secim = secilenIslemlernew[getRndInteger(0, secilenIslemlernew.length - 1)];

  for(let i = 0; i < secilenIslemlernew.length; i++){
    if(secilenIslemlernew[i] === secim){
      //sadece secilenIslemlernew içindeki işlemi çıkar
      secilenIslemlernew.splice(i,1);
    }
  }

  let secimm;

  Soru = {};

  switch (secim) {
    case "toplama":
      if (zorluk === "kolay") {
        Number1 = getRndInteger(1, 10);
        Number2 = getRndInteger(1, 10);
      } else if (zorluk === "orta") {
        Number1 = getRndInteger(10, 30);
        Number2 = getRndInteger(10, 30);
      } else if (zorluk === "zor") {
        Number1 = getRndInteger(30, 80);
        Number2 = getRndInteger(30, 80);
      } // Zorluk seviyesine göre sayıları belirle

      cevap = Number1 + Number2;
      secimm = "toplama";
      document.getElementById("soru").innerHTML = `${Number1} + ${Number2} = `;
      break;
    case "cikartma":
      if (zorluk === "kolay") {
        Number1 = getRndInteger(1, 10);
        Number2 = getRndInteger(1, 10);
      } else if (zorluk === "orta") {
        Number1 = getRndInteger(10, 30);
        Number2 = getRndInteger(10, 30);
      } else if (zorluk === "zor") {
        Number1 = getRndInteger(30, 80);
        Number2 = getRndInteger(30, 80);
      } // Zorluk seviyesine göre sayıları belirle
      
      if (Number1 < Number2) [Number1, Number2] = [Number2, Number1];
      cevap = Number1 - Number2;
      secimm = "cikartma";
      document.getElementById("soru").innerHTML = `${Number1} - ${Number2} = `;
      break;
    case "carpma":
      if (zorluk === "kolay") {
        Number1 = getRndInteger(1, 10);
        Number2 = getRndInteger(1, 10);
      } else if (zorluk === "orta") {
        Number1 = getRndInteger(10, 20);
        Number2 = getRndInteger(1, 10);
      } else if (zorluk === "zor") {
        Number1 = getRndInteger(20, 30);
        Number2 = getRndInteger(5, 15);
      } // Zorluk seviyesine göre sayıları belirle

      cevap = Number1 * Number2;
      secimm = "carpma";
      document.getElementById("soru").innerHTML = `${Number1} × ${Number2} = `;
      break;
    case "bolme":
      if (zorluk === "kolay") {
        Number1 = getRndInteger(1, 10);
        Number2 = getRndInteger(1, 10);
      } else if (zorluk === "orta") {
        Number1 = getRndInteger(10, 20);
        Number2 = getRndInteger(1, 10);
      } else if (zorluk === "zor") {
        Number1 = getRndInteger(15, 30);
        Number2 = getRndInteger(1, 15);
      } // Zorluk seviyesine göre sayıları belirle
      
      Number1 = Number1 * Number2; // Bölme tam sayı çıkması için tam sayıya çeviriyoruz.
      cevap = Number1 / Number2;
      secimm = "bolme";
      document.getElementById("soru").innerHTML = `${Number1} ÷ ${Number2} = `;
      break;
  }
  
  let secimmm;
  switch (secim) {
    case "toplama":
    case "cikartma":
      secimmm = 1;
      break;
    case "carpma":
    case "bolme":
      secimmm = 3;
      break;
  }

  Soru = {Number1:Number1, Number2:Number2, islem:secim, cevap:cevap, verilenCevap:"?", islempaun : secimmm};
  
  let input = document.getElementById("SoruInput");

  if (beklemek === true) {
    // Önceki event listener'ı kaldır
    if (handleKeyDown) {
        input.removeEventListener("keydown", handleKeyDown);
    }

    // Yeni event listener'ı tanımla ve kaydet
    handleKeyDown = function (event) {
        if (event.key === "Enter" && beklemek) {
            beklemek = false;
            Cevaplamak(input, cevap, secimm,secilenIslemlernew); // Doğru işlemi gönderiyoruz.
        }
    };

    input.addEventListener("keydown", handleKeyDown);
  }
}

function Cevaplamak(input, cevap,secim,secilenIslemlernew) {
  let value = parseFloat(input.value);
  
  if (input.value.trim() === "" || isNaN(value)) {
    alert("Lütfen geçerli bir sayı girin!");
    return;
  }else if (value === cevap) {
    
    dogruSayisi++;
    
    innerHTML("dogruSayisi", "Doğru: " + dogruSayisi);
    innerHTML("puan", "Puan: " + puan);

    switch (secim) {
      case "toplama":
      case "cikartma":
        SoruPuanKatsayisi += 1;
        break;
      case "carpma":
      case "bolme":
        SoruPuanKatsayisi += 3;
        break;
    }
    
  } else {
    
    yanlisSayisi++;
    innerHTML("yanlisSayisi", "Yanlış: " + yanlisSayisi);
    innerHTML("puan", "Puan: " + puan);
  }
  
  Soru.verilenCevap = value;
  
  Sorular.push(Soru);
  
  setTimeout(function () {
    beklemek = true;
    soru(secilenIslemlernew);
  }, 100);
}

function EndGame() {

  clearInterval(timerInterval);
  
  if(((dogruSayisi - yanlisSayisi) + SoruPuanKatsayisi) > 0){
     
     PuanHesap(dogruSayisi,yanlisSayisi,zorlukKatsayisi,sure2);
    
  }else{
    puan = 0;
  }
  
  GoToFunction("Sonuc");
  
  document.getElementById("Sonuc").innerHTML = "";
  
  for (let i = 0; i < Sorular.length; i++) {
    Soru = Sorular[i];
    switch (Soru.islem) {
      case "toplama":
          Soru.islem = "+";
        break;
      case "cikartma":
          Soru.islem = "-";
        break;
      case "carpma":
          Soru.islem = "×";
        break;
      case "bolme":
          Soru.islem = "÷";
        break;
    }
  }
  
  Paragraflar = [
    ["<h1>Oyun Bitti !</h1>",
     
     `<span class="kutu radius">Doğru sayısı: <span class="Minikutu radius green"><b>${dogruSayisi}</b></span> | Yanlış sayısı: <span class="Minikutu radius red"><b>${yanlisSayisi}</b></span></span>`,

     `<span class="kutu radius">4 İşlemlerin toplamı: ${SoruPuanKatsayisi}</span>`,
     
     `<span class="kutu radius">Zorluk: <span class="Minikutu radius Z${zorlukKatsayisi}">${zorluk}</span> | ZorlukPuanı: <span class="Minikutu radius Z${zorlukKatsayisi}">${zorlukKatsayisi}</span></span>`,
     
     `<span class="kutu radius">Süre : ${sure2}</span>`,
     
     `<b class="kutu radius">PUAN : ${puan}</b>`,
     
    [
      `<button class="buton" onclick="ToggleOperation(document.getElementById('paragraf7'),'close')"><b>Soru geçmişine bak</b></button>
          <div class="close" id="paragraf7">
          <p>Soru geçmişi</p>
          <p>Ekstra = sorunun işlemine(+,-,×,÷) göre ekstra puan</p>
          <ul id="SoruGecmisiUl" class="radius">

              <li id="SoruGecmisiLi1" class="radius"><div id="SoruGecmisiSoru" class="radius">Sorular</div>
              <div id="SoruGecmisiCevap" class="radius"><span id="SoruGecmisiCevap2" class="radius">Cevabın</div></span>
              <div id="SoruGecmisiCevapPlus" class="radius"><span id="SoruGecmisiCevap2" class="radius">Ekstra</div></span>
              </li>

              ${Sorular.map(
              (soru) => 
              `<li id="SoruGecmisiLi" class="radius">
              <div id="SoruGecmisiSoru" class="radius">${soru.Number1} ${soru.islem} ${soru.Number2} = ${soru.cevap}</div>
              <div id="SoruGecmisiCevap" class="radius"><span id="SoruGecmisiCevap2" class="${soru.verilenCevap === soru.cevap ? "true" : soru.verilenCevap == "?" ? "Truse" : "false"} radius">${soru.verilenCevap}</div></span>
              <div id="SoruGecmisiCevap" class="radius"><span id="SoruGecmisiCevap2" class="${soru.verilenCevap === soru.cevap ? "true" : soru.verilenCevap == "?" ? "Truse" : "false"} radius">${soru.verilenCevap === soru.cevap ? "+" + soru.islempaun : "+0"}</div></span>

              </li>`
          ).join("")}
          </ul>
          </div>`
    ],

     `<button id="BigButton3" class="buton BigButton" onclick="GoToFunction('menu')"><b>Ana Menüye Dön</b></button>`,

     "<hr>",

     "<h1>SORULAR</h1>",
     
     `<button class="buton" onclick="ToggleOperation(document.getElementById('paragraf4'),'close')" ><b>Zorluk Nasıl Hesaplanıyor?</b></button>`,
     
     `<span class="kutu radius close" id="paragraf4">Zorluk kolaysa = <span class="Minikutu radius Z1">1</span> | Zorluk ortaysa = <span class="Minikutu radius Z3">3</span> | Zorluk zorsa = <span class="Minikutu radius Z5">5</span></span>`
    ],
    [
      `<button class="buton" onclick="ToggleOperation(document.getElementById('paragraf8'),'close')"><b>4 İşlemlerin toplamı nasıl hesaplanır?</b></button>
      <div class="close" id="paragraf8">
      <p><span class="kutu radius">Her çözdüğün soruya göre verilen puan :</span></p>
      <p><span class="kutu radius">toplama(+) ve çıkartma(-) çözdüysen = <b>1</b> | çarpma(×) ve bölme(÷) çözdüysen = <b>3</b></span></p>
      </div>`
    ],
    [
      `<button class="buton" onclick="ToggleOperation(document.getElementById('paragraf5'),'close')"><b>Puan Nasıl Hesaplanılıyor?</b></button>`,
      
      `<div class="close" id="paragraf5">

        <p><div class="kutu radius">((((<span class="Minikutu radius green">Doğru sayısı</span> - <span class="Minikutu radius red">Yanlış Sayısı</span>) + <span class="Minikutu radius Z2">4 İşlemlerin toplamı</span>) × <span class="Minikutu radius Z${zorlukKatsayisi}">Zorluk</span>) × 100) ÷ <span class="Minikutu radius Z6">süre</span> = <b class="Minikutu radius Z0">PUAN</b></div></p>

        <p><div class="kutu radius"> ((((<span class="Minikutu radius green">${dogruSayisi}</span> - <span class="Minikutu radius red">${yanlisSayisi}</span>) + <span class="Minikutu radius Z2">${SoruPuanKatsayisi}</span>) × <span class="Minikutu radius Z${zorlukKatsayisi}">${zorlukKatsayisi}</span>) × 100) ÷ <span class="Minikutu radius Z6">${sure2}</span> = <b class="Minikutu radius Z0">PUAN</b></div></p>

        <p><div class="kutu radius"> (((<span class="Minikutu radius Z4">${dogruSayisi - yanlisSayisi}</span> + <span class="Minikutu radius Z2">${SoruPuanKatsayisi}</span>) × <span class="Minikutu radius Z${zorlukKatsayisi}">${zorlukKatsayisi}</span>) × 100) ÷ <span class="Minikutu radius Z6">${sure2}</span> = <b class="Minikutu radius Z0">PUAN</b></div></p>

        <p><div class="kutu radius"> ((<span class="Minikutu radius Z4">${(dogruSayisi - yanlisSayisi) + SoruPuanKatsayisi}</span> × <span class="Minikutu radius Z${zorlukKatsayisi}">${zorlukKatsayisi}</span>) × 100) ÷ <span class="Minikutu radius Z6">${sure2}</span> = <b class="Minikutu radius Z0">PUAN</b></div></p>

        <p><div class="kutu radius"> (<span class="Minikutu radius Z4">${((dogruSayisi - yanlisSayisi) + SoruPuanKatsayisi) * zorlukKatsayisi}</span> × 100) ÷ <span class="Minikutu radius Z6">${sure2}</span> = <b class="Minikutu radius Z0">PUAN</b></div></p>

        <p><div class="kutu radius"> <span class="Minikutu radius Z4">${(((dogruSayisi - yanlisSayisi) + SoruPuanKatsayisi) * zorlukKatsayisi * 100)}</span> ÷ <span class="Minikutu radius Z6">${sure2}</span> = <b class="Minikutu radius Z0">${puan} : PUAN</b></div></p></div>`
    ]
  ];

  
  
  for (let i = 0; i < Paragraflar.length; i++) {
    
    let Kutu1;
    
    for(let a = 0; a < Paragraflar[i].length; a++){
        
        let paragraf = document.createElement("p");
        
        paragraf.innerHTML = Paragraflar[i][a];

        document.getElementById("Sonuc").appendChild(paragraf);
    }
    
}
  HistoryFunction();
  
}

function HistoryFunction(){
  
  Historyy = {dogruSayisi:dogruSayisi,yanlisSayisi:yanlisSayisi,SoruPuanKatsayisi:SoruPuanKatsayisi,zorluk:zorluk,zorlukKatsayisi:zorlukKatsayisi,sure:sure2,puan:puan,Sorular:Sorular,OyunTamSurumu:OyunTamSurumu};

  AllHistory.push(Historyy);

  //bunu kaydetmek için bir fonksiyon yazılacak
  localStorage.setItem("AllHistory", JSON.stringify(AllHistory));
}

function PuanHesap(Dogru,Yanlis,zorluk,sure) {
  puan = ((Dogru - Yanlis) + SoruPuanKatsayisi) * zorluk * 100 / sure;
  puan = Math.round(puan);
}

function HistoryUploudFunction(){

  GoToFunction('MegaHistoryBox');

  innerHTML("MegaHistoryBox", `
    <div id="Xbutton" class="history-box">
    <button id="XButton" onclick="GoToFunction('menu')">×</button>
    </div>`);

    // AllHistory boş mu değil mi kontrolü
  if(AllHistory.length === 0){

    innerHTML("MegaHistoryBox", document.getElementById("MegaHistoryBox").innerHTML + "<p style='color : rgba(255, 255, 255, 0.42)'>Geçmişinizde hiç oyun yok</p>");

  }else{

  for (let i = 0; i < AllHistory.length; i++) {

    if (AllHistory.length !== 0) {

  Historyy = AllHistory[i];


  paragraflar2 = [
    `<div id="history-box" style="line-height: 0.3;" class="history-box">
     
          <p class="history-boxP" style="font-size:30px;"><b>PUAN : ${Historyy.puan}</b></p>
          <br>
          <button onclick="ToggleOperation(document.getElementById('Ayrintilar${i}'),'close')" class="buton butons">Ayrıntılar</button>
          <div id="Ayrintilar${i}" class="Ayrintilar close" style="background-color: #00000000;">
            <div class="AyrintilarMini radius" style="background-color: #2f0038; padding: 10px;">
              
          <p class="history-boxP" style="background-color: #6f0358; font-size: 30px;"><b>Soru geçmişi</b></p>
          <br>
          <p class="history-boxP" style="background-color: #560143;">Ekstra = sorunun işlemine(+,-,×,÷) göre ekstra puan</p>
          <ul id="SoruGecmisiUl" class="radius">

              <li id="SoruGecmisiLi1" class="radius"><div id="SoruGecmisiSoru" class="radius">Sorular</div>
              <div id="SoruGecmisiCevap" class="radius"><span id="SoruGecmisiCevap2" class="radius">Cevabın</div></span>
              <div id="SoruGecmisiCevapPlus" class="radius"><span id="SoruGecmisiCevap2" class="radius">Ekstra</div></span>
              </li>
              ${Historyy.Sorular.map(
              (soru) => 
              `<li id="SoruGecmisiLi" class="radius">
              <div id="SoruGecmisiSoru" class="radius">${soru.Number1} ${soru.islem} ${soru.Number2} = ${soru.cevap}</div>
              <div id="SoruGecmisiCevap" class="radius"><span id="SoruGecmisiCevap2" class="${soru.verilenCevap === soru.cevap ? "true" : soru.verilenCevap == "?" ? "Truse" : "false"} radius">${soru.verilenCevap}</div></span>
              <div id="SoruGecmisiCevap" class="radius"><span id="SoruGecmisiCevap2" class="${soru.verilenCevap === soru.cevap ? "true" : soru.verilenCevap == "?" ? "Truse" : "false"} radius">${soru.verilenCevap === soru.cevap ? "+" + soru.islempaun : "+0"}</div></span>

              </li>`
          ).join("")}
          </ul>
            </div>
            <div class="AyrintilarMini2 radius" style="background-color: #156545;">
              <p class="history-boxP" style="background-color: #015e1a; font-size: 30px;"><b>Puanlar</b></p>
              <br>
              <p class="history-boxP">Doğru sayısı: <span class="history-boxS Z1">${Historyy.dogruSayisi}</span></p>
              <br>
              <p class="history-boxP">Yanlış sayısı: <span class="history-boxS Z5">${Historyy.yanlisSayisi}</span></p>
              <br>
              <p class="history-boxP">Zorluk: <span class="history-boxS Z${Historyy.zorlukKatsayisi}">${Historyy.zorluk}</span></p>
              <br>
              <p class="history-boxP">Süre: <span class="history-boxS Z6">${Historyy.sure}</span></p></div>
          </div>
    </div>`

  ];

    innerHTML("MegaHistoryBox", document.getElementById("MegaHistoryBox").innerHTML + paragraflar2);
    }
  }
}
}






// Sayfa yüklendiğinde yapılacaklar
$(document).ready(function(){

  OyunSurumuKontrol();

  function OyunSurumuKontrol() {
    OyunTamSurumu = `${OyunSurumuBasamak1}.${OyunSurumuBasamak2}.${OyunSurumuBasamak3}`;

    innerHTML("Surum", `v${OyunTamSurumu}`);
  }
  

  //Yapılacaklar listesi
  //1. Soru geçmişine bak butonu

});//document.ready end