const content =
    `<h3 class="ui header">{%placeName%}</h3>
            <div>Rating : 
            <fieldset class="rate">
                <input type="radio" id="rating10" name="rating" value="10" disabled {%5%}/><label for="rating10" title="5 stars"></label>
                <input type="radio" id="rating9" name="rating" value="9" disabled {%4.5%}/><label class="half" for="rating9" title="4 1/2 stars"></label>
                <input type="radio" id="rating8" name="rating" value="8" disabled {%4%}/><label for="rating8" title="4 stars"></label>
                <input type="radio" id="rating7" name="rating" value="7" disabled {%3.5%}/><label class="half" for="rating7" title="3 1/2 stars"></label>
                <input type="radio" id="rating6" name="rating" value="6" disabled {%3%}/><label for="rating6" title="3 stars"></label>
                <input type="radio" id="rating5" name="rating" value="5" disabled {%2.5%}/><label class="half" for="rating5" title="2 1/2 stars"></label>
                <input type="radio" id="rating4" name="rating" value="4" disabled {%2%}/><label for="rating4" title="2 stars"></label>
                <input type="radio" id="rating3" name="rating" value="3" disabled {%1.5%}/><label class="half" for="rating3" title="1 1/2 stars"></label>
                <input type="radio" id="rating2" name="rating" value="2" disabled {%1%}/><label for="rating2" title="1 star"></label>
                <input type="radio" id="rating1" name="rating" value="1" disabled {%0.5%}/><label class="half" for="rating1" title="1/2 star"></label>
            </fieldset>            
            </div>
            <div><a href="{%placeRouting%}" target="_blank">Bring me here</a></div>
            <div style="max-width:400px; margin:0 auto"><img src="{%placeImage%}" style="width:100%"/></div>`

module.exports = content