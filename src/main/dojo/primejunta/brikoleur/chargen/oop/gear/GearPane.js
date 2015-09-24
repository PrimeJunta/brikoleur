define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/topic",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dijit/form/Button",
        "./_ItemControl",
         "./../../_base/_FeaturePaneBase",
         "dojo/i18n!primejunta/brikoleur/nls//CharGen" ],
function( declare,
          lang,
          topic,
          array,
          domConstruct,
          Button,
          _ItemControl,
          _FeaturePaneBase, i18n )
{
    return declare([ _FeaturePaneBase ],
    {
        title : i18n.Gear,
        icon : "suitcase",
        postCreate : function()
        {
            domConstruct.create( "div", { "class" : "br-buttonSpacer" }, this.domNode, "last" );
            this.addItemControl = new Button({ label : "<i class='fa fa-plus-square br-blue'></i>", onClick : lang.hitch( this, this._addItem ), "class" : "br-wideAddButton" } ).placeAt( this.containerNode );
            this._addItem();
        },
        pleaseRemove : function( item )
        {
            this.controls.splice( array.indexOf( this.controls, item ), 1 );
            this._checkRemove();
        },
        _addItem : function( props )
        {
            this.addField( "item", _ItemControl, lang.mixin( props || {}, { parent : this } ), this.addItemControl.domNode, "before" );
            this._checkRemove();
        },
        _checkRemove : function()
        {
            topic.publish( "/SetGearRemoveLock/", this.controls.length <= 1 );
        },
        _setState : function( state )
        {
            this.clear();
            for( var i = 0; i < state.length; i++ )
            {
                if( state[ i ] )
                {
                    this._addItem({ value : state[ i ].value })
                }
            }
        }
    });
});