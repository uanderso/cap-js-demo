# cap-js-demo
Demo-applikation för en workshop i applikationsutveckling i JavaScript.

## Kort om applikationsutveckling i JS
Eftersom det i JavaScript till skillnad från andra programeringsspråk, till exempel C++ och Java, inte finns något i språket inbyggt stöd för beroendehantering är det upp till utvecklarna att hålla ordning på och i sin kod. Det faktum att JavaScript är löst typat samt att det i fallet med en webläsare finns ett enda globalt scope i vilket all kod körs i, ställer ytterligare krav på ordning och reda från projektstarten. Risken är annars att det i takt med att projektet och antalet utvecklare växer blir nästintill omöjligt att hålla reda på funktionalitet, variabelnamn och  namespaces. I den här exempelapplikationen har dessa problem bemötts med den strategi som bekrivs nedan. Mycket av tänket är inspirerat av ramverket [Backbone.js](http://documentcloud.github.com/backbone/), som är en bra blandning av flexibilitet och stöd vid applikationsutveckling i JavaScript.

### Loose coupling, Mediator pattern
Om vi kan dela upp funktionalitet i mindre moduler blir det lättare att arbeta med ett eller ett fåtal problem i taget, och det blir lättare för flera utvecklare att arbeta parallellt. Vi vill att varje del, eller modul, ska vara så självständig som möjligt. Dels för att vi ska kunna testa varje del för sig men även för att alla moduler inte ska gå sönder bara för att en av dem gör det. Vi vill alltså att modulerna ska vara löst kopplade till varandra (loose coupling). Det finns ett flertal designmönster som hanterar detta på lite olika sätt, vi använder ett som kallas Mediator och som i korthet bygger på att ha en central "hub" som håller reda på vilka moduler som finns i hela systemet samt vidarebefordrar meddelanden mellan modulerna, så att modulerna själva inte behöver ha någon vetskap om varandra.
<p align="center">
	<a href="https://raw.github.com/cpak/cap-js-demo/master/presentation/mediator.png" title="Större bild"><img src="https://raw.github.com/cpak/cap-js-demo/master/presentation/mediator.png" width="50%" /></a>
</p>
Den centrala komponenten i vår app är ett "vanligt" objekt som kallar vi just `App` (se `App.js`). Den har en `eventBus` som är det interface modulerna använder för att skicka meddelanden eller events till resten av systemet. Det innebär att ett event från Modul A kommer att nå Modul B (förutsatt att Modul B ör konfigurerat att lyssna efter event av typen "A"). Men att även en Modul C, som kanske läggs till senare, kommer att kunna ta emot event av typen "A". Modul A själv vet däremot inget om hur många eller vilka moduler som lyssnar efter dess events.

### Separation of concerns
I vår enkla applikation finns i princip två typer av funktionalitet:

1.	Hantering av vår "model", dvs. läs/skriv kontaktdata
2.	Manipulation av det grafiska gränssnittet, dvs. diverse anrop till webläsarens DOM API för att ändra utseendet på sidan.

Vi vill försöka hålla isär dessa typer av funktionalitet eftersom de egentligen inte har något med varandra att göra (en kontaktbok är på inget sätt bunden till ett visst utseende eller sätt att presentera dess innehåll) och listan samt de andra elementen i vår app kan ju användas för att visa nästan vilken information som helst. Separationen innebär dessutom att vi enkelt kan byta ut vissa delar av koden enklare. Vi kan t.ex. bygga ett helt nytt GUI, utan att ha sönder någon av den underliggande logiken som hämtar våra kontaker från servern mm. Även här finns designmönster till vår hjälp. De flesta är säkert bekanta med Model View Controller (MVC) och/eller Model View ViewModel (MVVM), Model View Presenter (MVP). Vi använder här något man skulle kunna kalla Model View Collection, som alltså består av tre delar:

<p align="center">
	<a href="https://raw.github.com/cpak/cap-js-demo/master/presentation/mvx.png" title="Större bild"><img src="https://raw.github.com/cpak/cap-js-demo/master/presentation/mvx.png" width="50%" /></a>
</p>

1. Model - i vårt fall har vi bara en modell och det är en kontakt. I vår kontaktmodell hanterar vi de attribut en kontakt kan ha, samt hur dessa uppdateras.
2. View - vi har tre vyer: en lista med alla kontakter, en detaljerad vy som även är en editor samt ett statusfält som kan visa diverse systemmeddelanden.
3. Collection - har i uppgift att hämta instanser av vår modell (kontakter) från vår lagring samt skriva ned dem vid ändring.


### Projektstruktur
En tydlig filstruktur underlättar både för en själv och för andra utvecklare i projektet. Exakt hur denna ser ut spelar kanske mindre roll så länge alla inbldandade kan förstå den och respekterar den. Vårt exempelprojekt har sina filer organiserade såhär:

<pre>
rot
 ├─ data - statisk data eftersom vi i exemplet inte har någon back-end att köra mot
 ├─ js
 |	 ├─ models - innehåller JS för vår modell och vår "collection"
 |	 └─ views - innehåller JS för våra vyer
 ├─ (presentation)
 ├─ resources - innehåller resurser vår applikation använder (bilder, css) samt
 |		JS-bilbiotek så att dessa inte editeras "av misstag"
 ├─ README.md - denna fil
 └─ index.html - startpunkten för vår app
</pre>

`index.html` är vår enda entry point. Det gör det enkelt för oss att se till att alla nödvändiga JS-filer är laddade då appens logik startas. Längst ned i `index.html` ligger de script-taggar som drar in vår applikationskod. Eftersom både modeller och vyer "lägger till sig själva" i vår centrala `App` laddas de efter huvudfilen `App.js`. Att script-taggarna ligger sist i dokumentets `body`-tag innebär att hela sidan kommer renderas innan scripten laddas och användaren kommer inte mötas av en helt vit skärm medan laddningen pågår.

<pre>
		&lt;script src="js/App.js"&gt;&lt;/script&gt;
		&lt;script src="js/models/Contacts.js"&gt;&lt;/script&gt;
		&lt;script src="js/views/ContactList.js"&gt;&lt;/script&gt;
		&lt;script src="js/views/ContactEditor.js"&gt;&lt;/script&gt;
		&lt;script src="js/views/StatusMessage.js"&gt;&lt;/script&gt;
	&lt;/body&gt;
</pre>

### Länkar
*	[Addy Osmani - Learning JavaScript Design Patterns](http://addyosmani.com/resources/essentialjsdesignpatterns/book/)
*	[Organizing your Backbone.js application with modules](http://weblog.bocoup.com/organizing-your-backbone-js-application-with-modules/) (går även bra att applicera på icke-Backbone-projekt)
*	[Fråga/svar/diskussion på Stackoverflow](http://stackoverflow.com/questions/6529627/best-practices-for-developing-larger-javascript-applications)