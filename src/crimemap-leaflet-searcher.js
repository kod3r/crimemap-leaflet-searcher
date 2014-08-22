/* Copyright (C) 2014 Miroslav Bimbo <mbi@eea.sk>
*
* This file is part of Crimemap.
*
* Crimemap is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* Crimemap is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with Crimemap. If not, see <http://www.gnu.org/licenses/>.
*/
L.CrimemapLeafletSearcher = function(map){

    var renderFunction, results = 10, onfinish = function(){};
    var placeChooser,innerBox,searchForm,processing,enterNewSearch,chooseAnother,cancelSearch;

    var nameResolver = "http://nominatim.openstreetmap.org/search";

    function resetAll(){
        innerBox.selectAll(".place").classed({"active":false,"inactive":false}).style("display","inline-block");
    }

    function inactivateAll(){
        innerBox.selectAll(".place").classed({"active":false,"inactive":true});
    }

    function activate(node){
        d3.select(node).classed({"active":true,"inactive":false});
    }

    function onClick(d){
        panMap(d);
        inactivateAll();
        activate(this);
        chooseAnother.style("display","inline-block");
        enterNewSearch.style("display","inline-block");
        innerBox.selectAll(".place").style("display","none");
        cancelSearch.style("display","none");
    }

    function chooseAnotherCall(){
        chooseAnother.style("display","none");
        enterNewSearch.style("display","none");
        innerBox.selectAll(".place").style("display","inline-block");
        cancelSearch.style("display","inline-block");
    }

    function enterNewSearchCall(){
        enterNewSearch.style("display","none");
        chooseAnother.style("display","none");
        searchForm.style("display","inline-block");
        cancelSearch.style("display","inline-block");
    }

    function cancelSearchCall(){
        enterNewSearch.style("display","inline-block");
        if(!innerBox.select(".place").empty()){
            chooseAnother.style("display","inline-block");
            innerBox.selectAll(".place").style("display","none");
        }
        searchForm.style("display","none");
        cancelSearch.style("display","none");
    }

    function panMap(nomantimRecord){
        var boundingbox = nomantimRecord.boundingbox;
        var southWest = L.latLng(boundingbox[1], boundingbox[3]),
            northEast = L.latLng(boundingbox[0], boundingbox[2]),
            bounds = L.latLngBounds(southWest, northEast);

        map.fitBounds(bounds,{maxZoom:map.getMaxZoom()});
    }

    /********* PUBLIC ************/

    var searcher = {};

    function init(){

        placeChooser = d3.select(map.getContainer())
                            .append("div")
                            .attr("id","placeChooser");

        innerBox = placeChooser
                        .append("div")
                        .attr("id","innerBox");


        searchForm = innerBox.append("form")
                                 .attr("id","searchForm")
                                .style("display","none")
                                .on("submit",searcher.search);

        searchForm.append("input").attr("type","text").attr("id","searchTerm").attr("class","control");
        searchForm.append("input").attr("type","submit").attr("value","Hľadať").attr("id","searchSubmit").attr("class","control");

        processing = searchForm.append("div").attr("id","processing").attr("class","control");


        enterNewSearch = innerBox.append("div")
                            .attr("id","enterNewSearch")
                            .text("Vyhľadať lokalitu")
                            .on("click",enterNewSearchCall)
                            .attr("class","control");

        chooseAnother = innerBox.append("div")
                            .attr("id","chooseAnother")
                            .style("display","none")
                            .text("Zobraziť vyhľadané")
                            .on("click",chooseAnotherCall)
                            .attr("class","control");

        cancelSearch = innerBox.append("div")
                            .attr("id","cancelSearch")
                            .style("display","none")
                            .text("Zrušiť")
                            .on("click",cancelSearchCall)
                            .attr("class","control");

    }

    searcher.search = function(event){
        d3.event.preventDefault();
        var terms=this[0].value
                .trim()
                .replace(/\s+/g, "+");
        processing.classed({"errorinfo":false,"normalinfo":true}).text("Vyhladavam");
        d3.json(nameResolver+"?q="+terms+"&format=json&countrycodes=sk").get(function(error,data){
            if(error !== null){
                processing.classed({"errorinfo":true,"normalinfo":false}).text("Vyhladavanie zlyhalo");
                return;
            }
            data = data.slice(0,results);
            var binded = innerBox.selectAll(".place")
                    .data(data);

            binded.exit().remove();
            if(data.length>0){
                processing.classed({"normalinfo":false,"errorinfo":false}).text("");
                searchForm.style("display","none");

                var entered = binded.enter()
                    .append("div")
                    .classed({"place":"true"})
                    .on("click",onClick)
                    .style("width",(80/results-3)+"%");

                var updated = binded
                    .text(function(d){
                        return d.display_name
                            .replace(/Region of/g,"Kraj")
                            .replace(/Slovakia/g,"Slovensko")
                            .replace(/Eastern/g,"Východné")
                            .replace(/Western/g,"Západné")
                            .replace(/Central/g,"Stredné")
                            .replace(/District of/g,"Okres");
                    });

                    panMap(data[0]);

            }else{
                processing.classed({"errorinfo":true,"normalinfo":false}).text("Nenasiel sa ziaden vysledok");

            }

            resetAll();
            cancelSearch.style("display","inline-block");
            onfinish();
        });
    };

    searcher.renderFunction = function(_) {
        if (!arguments.length)
            return renderFunction;
        renderFunction = _;
        return searcher;
    };

    searcher.results = function(_) {
        if (!arguments.length)
            return results;
        results = _;
        return searcher;
    };

    searcher.onfinish = function(_) {
        if (!arguments.length)
            return onfinish;
        onfinish = _;
        return searcher;
    };

    init(map);
    return searcher;

};