define([ "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/topic",
        "dojo/string",
        "./../../_base/util",
        "dojo/i18n!./../../../nls/CharGen" ],
function( declare,
          lang,
          array,
          topic,
          string,
          util,
          i18n )
{
    return declare([ ], {
        allowedControls : 0,
        featureName : "",
        postCreate : function()
        {
            this.controls = [];
            this.featureAdded();
        },
        featureAdded : function( kwObj )
        {
            if( this.allowedControls < 0 || this.controls.length < this.allowedControls )
            {
                this.addControl( kwObj );
            }
            if( !Controller.loading )
            {
                this.publishStatus();
            }
            if( this.minimized && this.maximize )
            {
                this.maximize();
            }
        },
        publishStatus : function( synthetic)
        {
            topic.publish( this.selectedFeaturesTopic, util.getProperties( "value", this.controls ), synthetic );
        },
        addControl : function( kwObj, pos )
        {
            var ctl = new this.featureControl( lang.mixin( kwObj || {}, { parent : this } )).placeAt( this.containerNode, pos || "last" );
            this.controls.push( ctl );
            return ctl;
        },
        countItems : function()
        {
            return util.countItems( this.controls );
        },
        descendantFeatureAdded : function()
        {
        },
        validate : function()
        {
            if( this.allowedControls && util.filter( util.getProperties( "complete", this.controls, false, false ) ).length < this.allowedControls )
            {
                return {
                    valid : false,
                    message : string.substitute( i18n.PleaseSelectRequiredFeatures, { num : this.allowedControls, name : this.featureName } )
                }
            }
            else
            {
                return {
                    valid : true
                }
            }
        },
        clear : function()
        {
            while( this.controls.length > 0 )
            {
                this.controls.pop().destroy();
            }
        },
        _setState : function( state )
        {
            this.clear();
            for( var i = 0; i < state.length; i++ )
            {
                this.addControl().set( "state", state[ i ] );
            }
        }
    });
});