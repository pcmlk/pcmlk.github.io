# Einstellungen und debployment für pcmlk-www

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

