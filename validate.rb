module Validate

   EMAIL_RE = /^[a-z0-9.åäöÅÄÖ_\-]+@[a-z0-9.åäöÅÄÖ_\-]{1,62}[.][a-z0-9]{2,6}$/i
   NUMBER_RE = /^-?\d+$/

   class << self
      def form( params, reqs ) 
         errors = {}
         reqs.each { |name,field_reqs|
            value = params[name]
            if ( value.blank? ) 
               err = :empty if field_reqs[1]=='req'
            elsif ( field_reqs[0]=='same_as' ) 
               err = :not_same_as if value!=params[field_reqs[1]]
            else
               err = send( field_reqs[0], value.strip, field_reqs[1..-1] )
            end
            errors[name.to_sym] = err if err
         }
         return errors.blank? ? nil : errors
      end
   
      def string( value, reqs )
         reqs.each { |req| 
            next if req.class==String
            case req[0]
                when 'min' : return :too_short if value.length<req[1]
                when 'max' : return :too_long if value.length>req[1]
                when 'match'  : return :invalid_format if !( value=~req[1] )
                when 'not_match' : return :illegal_match if value=~req[1]
                else raise req.inspect
            end
         }
         return nil
      end
   
      def number( value, reqs )
         return :invalid_format if !( value=~NUMBER_RE )
         i = value.to_i
         reqs.each { |req| 
            next if req.class==String
            case req[0]
               when 'min' : return :below_min if i<req[1]
               when 'max' : return :above_max if i>req[1]
               else raise req.inspect
            end
         }
         return nil
      end
   
      def email( value, reqs )
         return :no_at_sign if !value.include?( '@' )
         return :invalid_format if !( value=~EMAIL_RE )
      end

      def emails( value, reqs )
         a = value.split( /,;/ )
         a.each { |s| 
            errors = Validate.email( s, reqs )
            return errors if errors
         }
         return nil
      end
   end
end


