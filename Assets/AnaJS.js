function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function innerHTML(girdi, girilen) {
    document.getElementById(girdi).innerHTML = girilen;
  }
  
  let Number1;
  let Number2;
  let cevap;
  let beklemek = true;
  let dogruSayisi = 0;
  let yanlisSayisi = 0;
  let sure = 30; // Varsayılan süre
  let secilenIslemler = ["toplama"]; // Varsayılan işlemler
  let puan = 0; // Varsayılan puan
  let zorluk = "kolay"; // Varsayılan zorluk
  let zorlukKatsayisi = 1; // Zorluk katsayısı
  let Paragraflar = []; //Oyun sonunda yazacak paragrafları belirler
  
  let SoruPuanKatsayisi = 0; //Soru katsayısı
  let handleKeyDown; // Global değişken olarak tanımlandı.

  //Oyunda hangi soruları yapmışız onların geçmişini gösterir
  let Sorular = [];
  let Soru = {};
  
  let timerInterval;
  
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
  
  function ApplySettings() {
    // Süre ayarını al
    let sureInput = document.getElementById("sureInput").value;
    sure = parseInt(sureInput);
    sure2 = sure
  
    if (isNaN(sure) || sure < 5 || sure > 120) {
      alert("Süre 5 ile 120 saniye arasında olmalıdır.");
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
      alert("En az bir işlem seçmelisiniz.");
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
        EndGame();
      }
    }, 1000);
  
    soru(secilenIslemlernew);
  }
  
  function soru(secilenIslemlernew) {

    document.getElementById("SoruInput").value = "";

    // Eğer seçilen işlemler bitti ise tekrar başa dön
    if (secilenIslemlernew.length === 0) {
      secilenIslemlernew = secilenIslemler;
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
    
    if(dogruSayisi > yanlisSayisi){
       
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
      ["Oyun Bitti !!",
       
       `<span class="kutu radius">Doğru sayısı: <span class="kutu radius green">${dogruSayisi}</span> | Yanlış sayısı: <span class="kutu radius red">${yanlisSayisi}</span></span>`,

       `<span class="kutu radius">4 İşlemlerin toplamı: ${SoruPuanKatsayisi}</span>`,
       
       `<span class="kutu radius">Zorluk: <span class="kutu radius Z${zorlukKatsayisi}">${zorluk}</span> | ZorlukPuanı: <span class="kutu radius Z${zorlukKatsayisi}">${zorlukKatsayisi}</span></span>`,
       
       `<span class="kutu radius">Süre : ${sure2}</span>`,
       
       `<b class="kutu radius">PUAN : ${puan}</b>`,
       
       `<button class="buton" onclick="ToggleOperation(document.getElementById('paragraf4'),'close')" ><b>Zorluk Nasıl Hesaplanıyor?</b></button>`,
       
       `<p class="close" id="paragraf4">Zorluk kolaysa = 1 | Zorluk ortaysa = 3 | Zorluk zorsa = 5</p>`
      ],
      [
        `<button class="buton" onclick="ToggleOperation(document.getElementById('paragraf8'),'close')"><b>4 İşlemlerin toplamı nasıl hesaplanır?</b></button>
        <div class="close" id="paragraf8">
        <p>Her çözdüğün soruya göre verilen puan :</p>
        <p>toplama(+) ve çıkartma(-) çözdüysen = 1 | çarpma(×) ve bölme(÷) çözdüysen = 3</p>
        </div>`
      ],
      [
        `<button class="buton" onclick="ToggleOperation(document.getElementById('paragraf5'),'close')"><b>Puan Nasıl Hesaplanılıyor?</b></button>`,
        
        `<div  class="close" id="paragraf5">
          <p> ((((Doğru sayısı - Yanlış Sayısı) × 4 İşlemlerin toplamı) × Zorluk) × 100) ÷ süre = <b>PUAN</b></p>
  
          <p> ((((${dogruSayisi} - ${yanlisSayisi}) × ${SoruPuanKatsayisi}) × ${zorlukKatsayisi}) × 100) ÷ ${sure2} = <b>PUAN</b></p>
  
          <p> (((${dogruSayisi - yanlisSayisi} × ${SoruPuanKatsayisi}) × ${zorlukKatsayisi}) × 100) ÷ ${sure2} = <b>PUAN</b></p>
  
          <p> ((${(dogruSayisi - yanlisSayisi) * SoruPuanKatsayisi} × ${zorlukKatsayisi}) × 100) ÷ ${sure2} = <b>PUAN</b></p>

          <p> (${(dogruSayisi - yanlisSayisi) * SoruPuanKatsayisi * zorlukKatsayisi} × 100) ÷ ${sure2} = <b>PUAN</b></p>
  
          <p> ${((dogruSayisi - yanlisSayisi) * SoruPuanKatsayisi * zorlukKatsayisi * 100)} ÷ ${sure2} = <b>${puan} : PUAN</b></p> </div>`
      ],
      [
        `<button class="buton" onclick="ToggleOperation(document.getElementById('paragraf7'),'close')"><b>Soru geçmişine bak</b></button>`
      ],
      [
            `<div class="close" id="paragraf7">
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
                <div id="SoruGecmisiCevap" class="radius"><span id="SoruGecmisiCevap2" class="${soru.verilenCevap === soru.cevap ? "true" : "false"} radius">${soru.verilenCevap}</div></span>
                <div id="SoruGecmisiCevap" class="radius"><span id="SoruGecmisiCevap2" class="${soru.verilenCevap === soru.cevap ? "true" : "false"} radius">${soru.verilenCevap === soru.cevap ? "+" + soru.islempaun : "+0"}</div></span>

                </li>`
            ).join("")}
            </ul>
            </div>`
    ],
      [
        `<button id="BigButton3" class="buton BüyükButon" onclick="GoToFunction('menu')"><b>Ana Menüye Dön</b></button>`
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
    
  }
  
  function ToggleOperation(Element,ClassNName) {
    
    if (Element.classList.contains(ClassNName)) {
      Element.classList.remove(ClassNName);
    } else {
      Element.classList.add(ClassNName);
    }
  }
  
  function PuanHesap(Dogru,Yanlis,zorluk,sure) {
    puan = (Dogru - Yanlis) * SoruPuanKatsayisi * zorluk * 100 / sure;
    puan = Math.round(puan);
  }

  //Yapılacaklar listesi
  //1. Soru geçmişine bak butonu
  //2. soru zorluğunu ayarla