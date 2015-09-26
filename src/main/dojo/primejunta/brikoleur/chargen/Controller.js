define([ "dojo/_base/declare",
         "dojo/_base/lang",
        "dojo/topic",
        "dojo/_base/array",
        "dojo/json",
        "dojo/string",
        "dojo/dom-class",
        "dojo/dom-geometry",
        "./_base/util",
         "./_base/DynamicGrid",
         "./oop/NamePane",
         "./oop/description/DescriptionPane",
         "./oop/gear/GearPane",
         "./oop/knacks/KnacksPane",
         "./oop/numbers/NumbersPane",
        "./oop/traits/TraitsPane",
        "./oop/powers/PowersPane",
        "./oop/stunts/StuntsPane",
        "./oop/ohun/OhunPane",
        "./store/CharacterStore",
         "dijit/layout/LayoutContainer",
         "dijit/layout/TabContainer",
         "dijit/layout/ContentPane",
         "dijit/form/NumberTextBox",
         "dijit/form/TextBox",
        "dijit/form/DropDownButton",
        "dijit/DropDownMenu",
        "dijit/MenuItem",
        "dijit/form/Button",
         "dijit/_TemplatedMixin",
         "dijit/_WidgetsInTemplateMixin",
         "dojo/text!./templates/Controller.html",
         "dojo/i18n!../nls/CharGen" ],
function( declare,
          lang,
          topic,
          array,
          json,
          string,
          domClass,
          domGeometry,
          util,
          DynamicGrid,
          NamePane,
          DescriptionPane,
          GearPane,
          KnacksPane,
          NumbersPane,
          TraitsPane,
          PowersPane,
          StuntsPane,
          OhunPane,
          CharacterStore,
          LayoutContainer,
          TabContainer,
          ContentPane,
          NumberTextBox,
          TextBox,
          DropDownButton,
          DropDownMenu,
          MenuItem,
          Button,
          _TemplatedMixin,
          _WidgetsInTemplateMixin,
          template,
          i18n )
{
    var Constr = declare([ LayoutContainer, _TemplatedMixin, _WidgetsInTemplateMixin  ], {
        dict : i18n,
        SMALL_THRESHOLD : 650,
        templateString : template,
        _panes : {},
        postCreate : function()
        {
            window.Controller = this;
            this.set( "is_new", true );
            domClass.replace( document.body, "tundra", "claro" );
            if( this.hasFullScreen() )
            {
                this.own( new Button({ label : "", "class" : "br-headerButton br-darkButton br-floatRight br-compactButton", iconClass : "fa fa-arrows", onClick : lang.hitch( this, this.toggleFullScreen) } ).placeAt( this.headerContentNodeRight, "first" ) );
            }
            this.newCharacterButton = new Button({ label : i18n.NewCharacter, "class" : "br-headerButton br-darkButton", iconClass : "fa fa-sun-o br-gold", onClick : lang.hitch( this, this.newCharacter) } ).placeAt( this.headerContentNode, "first" );
            this._ekipMenu = new DropDownMenu();
            this.refreshEkip();
            this._ekipMenu.startup();
            this.ekipButton = new DropDownButton({ dropDown : this._ekipMenu, label : i18n.Ekip, "class" : "br-headerButton br-darkButton", iconClass : "fa fa-users" } ).placeAt( this.headerContentNode, "first" );
            this.ekipButton.startup();
            this.own( this._ekipMenu, this.ekipButton, this.newCharacterButton );
            this._addPane( "name", new NamePane().placeAt( this.nameContainer ) );
            this._addPane( "traits", new TraitsPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "knacks", new KnacksPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "numbers", new NumbersPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "powers", new PowersPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "ohun", new OhunPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "stunts", new StuntsPane({ minimized : true, dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "gear", new GearPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this._addPane( "description", new DescriptionPane({ dock : this.dockContainer, container : this.oopGrid }).placeAt( this.oopGrid ) );
            this.loadSettings();
        },
        hasFullScreen : function()
        {
            return !!( document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen );
        },
        toggleFullScreen : function()
        {
            if( !document.fullscreenElement &&    // alternative standard method
                !document.mozFullScreenElement &&
                !document.webkitFullscreenElement &&
                !document.msFullscreenElement )
            {
                domClass.add( document.body, "em-fullScreen" );
                // current working methods
                if( document.documentElement.requestFullscreen)
                {
                    document.documentElement.requestFullscreen();
                }
                else if( document.documentElement.msRequestFullscreen)
                {
                    document.documentElement.msRequestFullscreen();
                }
                else if( document.documentElement.mozRequestFullScreen)
                {
                    document.documentElement.mozRequestFullScreen();
                }
                else if( document.documentElement.webkitRequestFullscreen)
                {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            }
            else
            {
                domClass.remove( document.body, "em-fullScreen" );
                if( document.exitFullscreen)
                {
                    document.exitFullscreen();
                }
                else if( document.msExitFullscreen)
                {
                    document.msExitFullscreen();
                }
                else if( document.mozCancelFullScreen)
                {
                    document.mozCancelFullScreen();
                }
                else if( document.webkitExitFullscreen)
                {
                    document.webkitExitFullscreen();
                }
            }
        },
        loadSettings : function()
        {
        },
        logState : function()
        {
            console.log( this.get( "state" ) );
        },
        loadState : function()
        {
            this.set( "state", json.parse( window.localStorage._debugState ) );
        },
        newCharacter : function()
        {
            this.saveCharacter();
            this.clear();
        },
        loadCharacter : function( name, dontSave )
        {
            if( !dontSave )
            {
                this.saveCharacter().then( lang.hitch( this, this.doLoadCharacter, name ));
            }
            else
            {
                this.doLoadCharacter( name );
            }
        },
        doLoadCharacter : function( name )
        {
            this.set( "is_new", false );
            this.set( "juju", CharacterStore.get( "juju" ) || 0 );
            this.set( "state", CharacterStore.load( name ) );
        },
        isValidName : function( name )
        {
            return !CharacterStore.nameInUse( name );
        },
        saveCharacter : function()
        {
            var cName = this._panes.name.get( "state" ).characterName;
            var juju = this.get( "juju" ) || 0;
            var diff = ( CharacterStore.get( "juju" ) || 0 ) - juju;
            if( cName )
            {
                if( this.is_new && juju > 0 )
                {
                    util.alert( i18n.YouHaveUnusedJuju );
                }
                else if( diff == 0 || this.is_new )
                {
                    this.doSaveCharacter( cName, juju );
                }
                else
                {
                    util.confirm( string.substitute( i18n.ConfirmSpendJuju, { juju : diff } ) ).then( lang.hitch( this, this.doSaveCharacter ) )
                }
            }
        },
        doSaveCharacter : function()
        {
            var cName = this._panes.name.get( "state" ).characterName;
            var juju = this.get( "juju" );
            if( !this.is_new )
            {
                CharacterStore.set( "juju", juju );
            }
            this.set( "is_new", false );
            CharacterStore.save( cName, this.get( "state" ) );
            topic.publish( "/CharacterSaved/" );
            this.refreshEkip();
        },
        deleteCharacter : function()
        {
            var charName = this._panes.name.get( "state" ).characterName;
            if( charName )
            {
                util.confirm( string.substitute( i18n.ConfirmDeleteCharacter, { charName : charName } ) ).then( lang.hitch( this, function()
                {
                    CharacterStore.remove( charName );
                    this.refreshEkip();
                    this.clear();
                }));
            }
        },
        revertCharacter : function()
        {
            if( this._panes.name.get( "state" ).characterName )
            {
                this.loadCharacter( this._panes.name.get( "state" ).characterName, true );
            }
        },
        publishJuju : function()
        {
            var juju = this.jujuInput.get( "value" );
            topic.publish( "/StatChanged/-juju", juju );
        },
        refreshEkip : function()
        {
            this._ekipMenu.destroyDescendants();
            var keys = CharacterStore.list();
            for( var i = 0; i < keys.length; i++ )
            {
                this._ekipMenu.addChild( new MenuItem({
                    label: keys[ i ],
                    onClick: lang.hitch( this, this.loadCharacter, keys[ i ] )
                }));
            }
        },
        clear : function()
        {
            var pn = this.domNode.parentNode;
            this.destroy();
            new Constr().placeAt( pn ).startup();
        },
        resize : function()
        {
            this.inherited( arguments );
            if( domGeometry.getContentBox( this.domNode ).w < this.SMALL_THRESHOLD )
            {
                domClass.add( this.domNode, "br-compactLayout" );
            }
            else
            {
                domClass.remove( this.domNode, "br-compactLayout" );
            }
        },
        get : function( prop )
        {
            if( prop == "juju" )
            {
                return this.jujuInput.get( "value" );
            }
            else if( prop == "state" )
            {
                var out = {};
                for( var o in this._panes )
                {
                    out[ o ] = this._panes[ o ].get( "state" );
                }
                return out;
            }
            else if( array.indexOf( this._panes.numbers.get( "properties" ), prop ) != -1 )
            {
                return this._panes.numbers.get( prop );
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        set : function( prop, val )
        {
            if( prop == "juju" )
            {
                this.jujuInput.set( "value", val );
            }
            else if( prop == "is_new" )
            {
                this.is_new = val;
                if( val )
                {
                    domClass.add( this.domNode, "br-newCharacter" );
                }
                else
                {
                    domClass.remove( this.domNode, "br-newCharacter" );
                }
            }
            else if( prop == "state" )
            {
                this.loading = true;
                for( var o in this._panes )
                {
                    this._panes[ o ].set( "state", val[ o ] );
                }
                this.publishJuju();
                topic.publish( "/PleasePublishStatus/", true );
                setTimeout( lang.hitch( this, function() { this.loading = false }), 1 );
            }
            else
            {
                this.inherited( arguments );
            }
        },
        _addPane : function( point, pane )
        {
            this._panes[ point ] = pane;
            this.own( pane );
        }
    });
    return Constr;
});