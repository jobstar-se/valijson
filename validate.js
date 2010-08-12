var Validate = {
   get_value: function( form, name ) { 
      return $.trim( form.find( "input[name=form[" + name + "]],textarea[name=form[" + name + "]]" ).val() );
   },
   form: function( form, reqs ) { 
      var errors = new Hash();
      var keys = reqs.keys();
      for ( var i = 0; i<keys.length; i++ ) { 
         var namex = keys[i];
         var error = Validate.field( form, namex, reqs.get( namex ) );
         if ( error ) errors.put( namex, error );
      }
      return errors.length>0 ? errors : null; 
   },
   field: function( form, name, reqs ) {
      var value = Validate.get_value( form, name );
      var fn_name = reqs[0];
      var error = null;
      if ( value=='' ) { 
         if ( reqs[1]=='req' ) error = 'empty';
      } else if ( fn_name=='same_as' ) {
         if ( value!=Validate.get_value( form, reqs[1] ) ) error = 'not_same_as';
      } else {
         eval( 'error = this.' + fn_name + '( value, reqs );' );  
      }
      return error;
   },
   string: function( value, reqs ) {
      for ( var i = 1; i<reqs.length; i++ ) {
         var req = reqs[i];
         if ( req=='req' ) continue;
         switch( req[0] ) {
            case 'min' : if ( value.length<req[1] ) return 'too_short'; break;
            case 'max' : if ( value.length>req[1] ) return 'too_long'; break;
            case 'match' : if ( !req[1].test( value ) ) return 'invalid_format'; break;
            case 'not_match' : if ( req[1].test( value ) ) return 'illegal_match'; break;
            default : throw( req[0] );
         }
      }
      return null;
   },
   number_re: /^-?\d+$/,
   number: function( value, reqs ) {
      if ( !Validate.number_re.test( value ) ) return 'invalid_format';
      var num = parseInt( value );
      for ( var i = 1; i<reqs.length; i++ ) {
         var req = reqs[i];
         if ( req=='req' ) continue;
         switch( req[0] ) {
            case 'min' : if ( num<req[1] ) return 'below_min'; break;
            case 'max' : if ( num>req[1] ) return 'above_max'; break;
            default : throw( req[0] );
         }
      }
      return null;
   },
   email_re: /^[a-z0-9.åäöÅÄÖ_\-]+@[a-z0-9.åäöÅÄÖ_\-]{1,62}[.][a-z0-9]{2,6}$/i,
   email: function( value, reqs ) {
      if ( value.indexOf( '@' )==-1 ) return 'no_at_sign';
      if ( !Validate.email_re.test( value ) ) return 'invalid_format';
      return null;
   },
   emails: function( value, reqs ) {
      var a = value.split( /[,;]/ );
      for ( var i = 0; i<a.length; i++ ) {
         var errors = Validate.email( a[i], reqs );
         if ( errors!=null ) return errors;
      }
      return null;
   }
};


