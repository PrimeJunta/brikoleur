/**
 * Task resolver pane.
 *
 * @public Widget
 */
define( [ "dojo/_base/declare",
          "dojo/_base/lang",
          "dojo/on",
          "./../../oop/powers/_PowerControl",
          "./../_base/_PoweredAbilityInPlayMixin",
          "dojo/text!./templates/_PowerControl.html",
          "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          on,
          _PowerControl,
          _PoweredAbilityInPlayMixin,
          template,
          i18n )
{
    return declare( [ _PowerControl, _PoweredAbilityInPlayMixin ],
    {
        stat : "mind",
        popupMessage : i18n.SpendMindPoints,
        statTooLowMessage : i18n.MindTooLow,
        templateString : template,
        postCreate : function()
        {
            this.inherited( arguments );
            this.own( on( this.valueNode, "click", lang.hitch( this, this.pleaseUsePower ) ) );
        }
    } );
} );