# Energiencrypt
Encodage-décodage de message par bloc pour escape game. La fonction n'encode ou ne décode que les caractères minuscules non accentués pour l'instant. Son exécution requiert une version 6+ de NodeJS.

## Décalage uniforme

Pour **encoder** un message selon _"l'avocat"_ ("_a_ vaut _k_"), le décalage entre les lettres et de 10 :

```sh
node encode.js 10 'je pars en kayak !'
# résultat :
zu fqhi ud aqoqa !
😊
```

Pour **décoder** un message encodé selon _"l'avocat"_ :

```sh
node decode.js 10 'zu fqhi ud aqoqa !'
# résultat :
je pars en kayak !
😊
```

## Décalage multiple

Pour **encoder** un message en prenant alternativement la lettre d'avant puis la lettre d'après :

```
node encode.js 1,-1 'je pars en kayak !'
# résultat :
if qzsr do lzzzl !
😊
```

De même pour le décoder :

```sh
node decode.js 1,-1 'if qzsr do lzzzl !'
# résultat :
je pars en kayak !
😊
```
