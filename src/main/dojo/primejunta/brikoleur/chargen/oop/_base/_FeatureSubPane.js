define([ "dojo/_base/declare",
         "dojo/_base/lang",
         "dojo/topic",
         "./_ControlPaneMixin",
         "dijit/_WidgetBase",
         "dijit/_TemplatedMixin",
         "dojo/text!./templates/_FeatureSubPane.html" ],
function( declare,
          lang,
          topic,
          _ControlPaneMixin,
          _WidgetBase,
          _TemplatedMixin,
          template )
{
    return declare([ _WidgetBase, _TemplatedMixin, _ControlPaneMixin ], {
        data : {},
        templateString : template,
        allowedControls : -1,
        value : "",
        key : "",
        postMixInProperties : function()
        {
            this.own( topic.subscribe( "/PleasePublishStatus/", lang.hitch( this, this.publishStatus ) ) );
        },
        publishStatus : function()
        {
            // stub
        },
        featureAdded : function( kwObj )
        {
            kwObj = kwObj || {};
            kwObj.key = this.key;
            kwObj.data = this.data;
            this.inherited( arguments, [ kwObj ] );
        },
        get : function( prop )
        {
            if( prop == "state" )
            {
                return this._getState();
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        set : function( prop, val )
        {
            if( prop == "state" )
            {
                this._setState( val );
            }
            else
            {
                return this.inherited( arguments );
            }
        },
        _getState : function()
        {
            var ctl = [];
            for( var i = 0; i < this.controls.length; i++ )
            {
                ctl.push( this.controls[ i ].get( "state" ) );
            }
            return {
                name : this.data.name,
                key : this.key,
                controls : ctl
            }
        },
        _setState : function( state )
        {
            this.inherited( arguments );
            this.key = state.key;
            for( var i = 0; i < state.controls.length; i++ )
            {
                this.addControl({ data : this.data }).set( "state", state.controls[ i ] );
            }
        }
    });
});