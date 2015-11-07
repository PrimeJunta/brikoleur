/**
 * Task resolver pane.
 *
 * @public Widget
 */
define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./../../oop/powers/PowersPane",
         "./_PowerSubPane",
         "dojo/i18n!primejunta/brikoleur/nls/CharGen" ],
function( declare,
          lang,
          topic,
          PowersPane,
          _PowerSubPane,
          i18n )
{
    return declare( [ PowersPane ],
    {
        childConstructor : _PowerSubPane,
        _checkActivePowers : function()
        {
        }
    } );
});