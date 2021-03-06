/**
 * Character name pane. This also controls the UI for toggling combat.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "../../widget/Switch",
          "../../_base/_NamePaneBase",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          Switch,
          _NamePaneBase,
          i18n )
{
    return declare( [ _NamePaneBase ], {
        /**
         * Owner pane.
         *
         * @public _IpPane
         */
        manager : {},
        /**
         * Create a toggle button for combat mode and connect it to ::toggleCombat.
         *
         * @public void
         */
        postCreate : function()
        {
            this.nameContainer.style.width = "calc( 100% - 198px )";
            this.buttonContainer.style.width = "198px";
            this.combatToggle = new Switch( {
                value : "on",
                style : "width:140px;",
                leftLabel : i18n.StartCombat,
                rightLabel : i18n.ExitCombat,
                onClick : lang.hitch( this, this.toggleCombat )
            } ).placeAt( this.buttonContainer );
            this.combatToggle.startup();
            this.own( this.combatToggle );
        },
        /**
         * Connect to manager.toggleCombat.
         *
         * @public void
         */
        toggleCombat : function()
        {
            this.manager.toggleCombat( this.combatToggle );
        }
    } );
} );