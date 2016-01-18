# Einstellungen und deployment für pcmlk-www

## Installation und Konfiguration openshift rhc Client

Ruby mit Ruby gems installieren:
```sh
$ sudo apt-get install ruby-full rubygems-integration
```

rhc Client installieren:
```sh
$ sudo gem install rhc
```

Konfiguration durch Folgen des Assistenten:
```sh
$ rhc setup
```

Applikationen anzeigen:
```sh
$ rhc apps
```

Information zur Applikation pcmlk anzeigen:
```sh
$ rhc app-show pcmlk
```

## Git für deployment zu openshift einrichten
Ins Entwicklungsverzeichnis wechseln in dort die Config-Datei im .git-Ordner um folgende Zeilen erweitern:
```
[remote "openshift"]
	url = ssh://<<ID>>@pcmlk-stekatdotcom.rhcloud.com/~/git/pcmlk.git/
	fetch = +refs/heads/*:refs/remotes/openshift/*
```
ID ... gibt es auf der Seite der Applikation oder über rhc Client

## Mit Git deployment ausführen
Prüfen in welchem Branch man sich befindet:
```sh
$ git branch
```

Ggf. in einen anderen Branch wechseln:
```sh
$ git checkout <<branch Name>>
```

Deployment starten:
```sh
$ git push --force openshift master
```
### Separater branch bei openshift für deployment
```sh
$ git push --force openshift openshift-pcmlk-www
```

Danach noch den branch fürs deployment über rhc Client einstellen