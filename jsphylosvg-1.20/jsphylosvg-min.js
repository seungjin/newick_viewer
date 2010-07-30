Smits={};Smits.Common={nodeIdIncrement:0,activeNode:0,roundFloat:function(d,c){for(var i=0,p=1;i<c;){p*=10;i++}return Math.round(d*p)/p},apply:function(d,c){if(d&&typeof c=="object")for(var i in c)d[i]=c[i];return d},addEventHandler:function(d,c,i,p){try{d.addEventListener(c,function(b){return function(y){p.e=y;b(p)}}(i,p),false)}catch(t){}}};
Smits.PhyloCanvas=function(){var d,c,i;return function(p,t,b,y,g){this.getNewickObject=function(){};this.clear=function(){};this.scale=function(u){i.svg.scale(u)};this.getSvg=function(){return i};this.getPhylogram=function(){return d};if(typeof p==="object")if(p.xml){p=p.fileSource?p.xml:XMLObjectifier.textToXML(p.xml);p=XMLObjectifier.xmlToJSON(p);dataObject=new Smits.PhyloCanvas.JsonParse(p)}else if(p.json)dataObject=new Smits.PhyloCanvas.JsonParse(p.json);else alert("Please set the format of input data");
else dataObject=new Smits.PhyloCanvas.NewickParse(p);c=t;i=new Smits.PhyloCanvas.Render.SVG(c,b,y);d=g=="circular"?new Smits.PhyloCanvas.Render.CircularPhylogram(i,dataObject):new Smits.PhyloCanvas.Render.Phylogram(i,dataObject)}}();Smits.PhyloCanvas.prototype={};Smits.PhyloCanvas.Node=function(){return function(d,c){this.id=Smits.Common.nodeIdIncrement+=1;this.newickLen=this.len=this.level=0;this.type=this.name="";this.chart={};d&&Smits.Common.apply(this,d);this.children=[];c&&c.children.push(this)}}();
Smits.PhyloCanvas.Node.prototype={getCountAllChildren:function(){var d=0;for(var c in this.children){var i=this.children[c];if(i.children&&i.children.length>0)d+=i.getCountAllChildren();else d++}return d}};
Smits.PhyloCanvas.NewickParse=function(){var d,c,i,p=0,t=0,b,y=function(h){for(var a=new Smits.PhyloCanvas.Node;c!==")"&&c!==",";)if(c===":"){f();a.len=Smits.Common.roundFloat(u(),4);if(a.len==0)a.len=1.0E-4}else if(c==="'"||c==='"'){a.type="label";a.name=F(c)}else{a.type="label";a.name=u()}a.level=h.level+1;return a},g=function(h){var a=new Smits.PhyloCanvas.Node;if(h)a.level=h.level+1;for(;c!==")";){f();c==="("?a.children.push(g(a)):a.children.push(y(a))}f();if(c!==":"&&c!==")"&&c!==","&&c!==";"){a.type=
"label";a.name=u()}if(c===":"){f();a.len=Smits.Common.roundFloat(u(),4);if(a.len==0)a.len=1.0E-4;a.type="stem"}return a},u=function(){for(var h="";c!==":"&&c!==")"&&c!==","&&c!==";";){h+=c;f()}return h},F=function(h){for(var a="";c!==h;){a+=c;f()}return a},f=function(){c=d.charAt(i);i+=1;return c},m=function(h){if(h.children&&h.children.length)for(var a=0;a<h.children.length;a++){var e=h.children[a];e.newickLen=Smits.Common.roundFloat(e.len+h.newickLen,4);if(e.level>p)p=e.level;if(e.newickLen>t)t=
e.newickLen;e.children.length>0&&m(e,h)}return h};return function(h){this.getRoot=function(){return b};this.getLevels=function(){return p};this.getNewickLen=function(){return t};this.getValidate=function(){};d=h;i=0;f();b=g();b=m(b)}}();Smits.PhyloCanvas.NewickParse.prototype={};
Smits.PhyloCanvas.JsonParse=function(){var d=0,c=0,i,p,t=function(b,y){var g=new Smits.PhyloCanvas.Node;if(y)g.level=y.level+1;if(b.clade&&b.clade.length)for(var u=0;u<b.clade.length;u++)g.children.push(t(b.clade[u],g));if(b.branch_length){if(typeof b.branch_length==="object")b.branch_length=b.branch_length[0].Text;g.len=Smits.Common.roundFloat(b.branch_length,4);if(g.len==0)g.len=1.0E-4}if(b.name){g.type="label";g.name=b.name[0].Text}if(b.sequence&&b.sequence[0]&&b.sequence[0].name&&b.sequence[0].name[0]&&
b.sequence[0].name[0].Text)g.sequenceName=b.sequence[0].name[0].Text;if(b.taxonomy&&b.taxonomy[0]){if(b.taxonomy[0].scientific_name&&b.taxonomy[0].scientific_name[0]&&b.taxonomy[0].scientific_name[0].Text)g.taxonomyScientificName=b.taxonomy[0].scientific_name[0].Text;if(b.taxonomy[0].common_name&&b.taxonomy[0].common_name[0]&&b.taxonomy[0].common_name[0].Text)g.taxonomyCommonName=b.taxonomy[0].common_name[0].Text}if(b.sequence&&b.sequence[0]&&b.sequence[0].accession&&b.sequence[0].accession[0]&&b.sequence[0].accession[0].Text)g.sequenceAccession=
b.sequence[0].accession[0].Text;if(b.point)g.LatLong=[b.point[0].lat[0].Text,b.point[0]["long"][0].Text];if(!g.name){if(g.sequenceName)g.name=g.sequenceName;else if(g.taxonomyScientificName)g.name=g.taxonomyScientificName;else if(g.taxonomyCommonName)g.name=g.taxonomyCommonName;else if(g.sequenceAccession)g.name=g.sequenceAccession;if(g.name)g.type="label"}if(b.annotation){if(b.annotation[0]&&b.annotation[0].desc&&b.annotation[0].desc[0]&&b.annotation[0].desc[0].Text)g.description=b.annotation[0].desc[0].Text;
if(b.annotation[0]&&b.annotation[0].uri&&b.annotation[0].uri[0]&&b.annotation[0].uri[0].Text)g.uri=b.annotation[0].uri[0].Text}if(b.chart)if(b.chart[0])for(u in b.chart[0])if(u!="Text"&&u!="_children")g.chart[u]=b.chart[0][u][0].Text;if(g&&g.level>1)g.len||(p="Error. Please include Branch Lengths - we only draw rooted phylogenetic trees.");return g};recursiveProcessRoot=function(b){if(b.children&&b.children.length)for(var y=0;y<b.children.length;y++){var g=b.children[y];g.newickLen=Math.round((g.len+
b.newickLen)*1E4)/1E4;if(g.level>d)d=g.level;if(g.newickLen>c)c=g.newickLen;g.children.length>0&&recursiveProcessRoot(g,b)}return b};recursiveProcessParameters=function(b,y){for(var g in b)if(g!="_children"&&g!="Text")if(g=="rectangular"||g=="circular")recursiveProcessParameters(b[g][0],g);else{Smits.PhyloCanvas.Render.Parameters[g]||(Smits.PhyloCanvas.Render.Parameters[g]={});Smits.PhyloCanvas.Render.Parameters.set(g,b[g][0].Text,y)}};return function(b){this.getRoot=function(){return i};this.getLevels=
function(){return d};this.getNewickLen=function(){return c};this.getValidate=function(){return p};u=b;if(b.phylogeny&&b.phylogeny[0]&&b.phylogeny[0].clade)i=t(b.phylogeny[0].clade[0]);if(b.phylogeny&&b.phylogeny[0]&&b.phylogeny[0].render&&b.phylogeny[0].render[0]){if((b=b.phylogeny[0].render[0])&&b.styles){var y=b.styles[0];for(var g in y)if(g!="_children"&&g!="Text"){Smits.PhyloCanvas.Render.Style[g]||(Smits.PhyloCanvas.Render.Style[g]={});for(var u in y[g][0])if(u!="_attributes")Smits.PhyloCanvas.Render.Style[g][u.replace("_",
"-")]=y[g][0][u]}}b&&b.parameters&&recursiveProcessParameters(b.parameters[0]);if(b&&b.charts){b=b.charts[0];for(g in b)if(g!="_children"&&g!="Text")for(u in b[g])if(b[g][u].type=="binary"){b[g][u].chart=g;Smits.PhyloCanvas.Render.Parameters.binaryCharts.push(b[g][u])}else if(b[g][u].type=="bar"){b[g][u].chart=g;Smits.PhyloCanvas.Render.Parameters.barCharts.push(b[g][u])}}}i=recursiveProcessRoot(i)}}();Smits.PhyloCanvas.JsonParse.prototype={};Smits.PhyloCanvas.Render={};
Smits.PhyloCanvas.Render.Style={line:{stroke:"rgb(0,0,0)","stroke-width":1},text:{"font-family":"Verdana","font-size":12,"text-anchor":"start"},path:{stroke:"rgb(0,0,0)","stroke-width":1},connectedDash:{stroke:"rgb(200,200,200)","stroke-dasharray":". "},textSecantBg:{fill:"#EEE",stroke:"#DDD"},highlightedEdgeCircle:{fill:"red"},barChart:{fill:"#003300",stroke:"#DDD"},getStyle:function(d,c){return this[d]?this[d]:this[c]}};
Smits.PhyloCanvas.Render.Parameters={jsOverride:0,Rectangular:{bufferX:200,bufferY:40,bufferInnerLabels:10,bufferOuterLabels:5,minHeightBetweenLeaves:10,alignRight:false},Circular:{bufferRadius:0.33,bufferAngle:20,initStartAngle:160,innerCircleRadius:0,minHeightBetweenLeaves:5,bufferInnerLabels:2,bufferOuterLabels:5},binaryCharts:[],barCharts:[],binaryChartBufferInner:5,binaryChartBufferSiblings:0.01,binaryChartThickness:15,binaryChartDisjointed:false,barChartBufferInner:3,barChartHeight:50,barChartWidth:0.5,
mouseRollOver:function(d){if(d.node.edgeCircleHighlight)d.node.edgeCircleHighlight.show();else{var c=d.svg.draw(new Smits.PhyloCanvas.Render.Circle(d.x,d.y,5,{attr:Smits.PhyloCanvas.Render.Style.highlightedEdgeCircle}));d.node.edgeCircleHighlight=c[0]}d.textEl.attr({fill:"red"})},mouseRollOut:function(d){d.node.edgeCircleHighlight.hide();d.textEl.attr({fill:"#000"})},set:function(d,c,i){if(!this.jsOverride)if(i)if(i=="circular")this.Circular[d]=parseFloat(c);else{if(i=="rectangular")this.Rectangular[d]=
parseFloat(c)}else this[d]=parseFloat(c)}};Smits.PhyloCanvas.Render.Line=function(){return function(d,c,i,p,t){this.type="line";this.x1=d;this.x2=c;this.y1=i;this.y2=p;if(t){Smits.Common.apply(this,t);if(t.attr)this.attr=t.attr}}}();Smits.PhyloCanvas.Render.Text=function(){return function(d,c,i,p){this.type="text";this.x=d;this.y=c;this.text=i;if(p){Smits.Common.apply(this,p);if(p.attr)this.attr=p.attr}}}();
Smits.PhyloCanvas.Render.Path=function(){return function(d,c){this.type="path";this.path=d;if(c){Smits.Common.apply(this,c);if(c.attr)this.attr=c.attr}}}();Smits.PhyloCanvas.Render.Circle=function(){return function(d,c,i,p){this.type="circle";this.x=d;this.y=c;this.radius=i;if(p){Smits.Common.apply(this,p);if(p.attr)this.attr=p.attr}}}();Smits.PhyloCanvas.Render.SVG=function(){return function(d,c,i){this.canvasSize=[c,i];this.svg=Raphael(d,this.canvasSize[0],this.canvasSize[1])}}();
Smits.PhyloCanvas.Render.SVG.prototype={render:function(){for(var d=this.phylogramObject.getDrawInstructs(),c=0;c<d.length;c++)if(d[c].type=="line")this.svg.path(["M",d[c].x1,d[c].y1,"L",d[c].x2,d[c].y2]).attr(Smits.PhyloCanvas.Render.Style.line);else if(d[c].type=="path")this.svg.path(d[c].path).attr(d[c].attr);else if(d[c].type=="circle")this.svg.circle(d[c].x,d[c].y,d[c].radius).attr({stroke:"red"});else{var i=this.svg.text(d[c].x,d[c].y,d[c].text).attr(Smits.PhyloCanvas.Render.Style.text);d[c].attr&&
i.attr(d[c].attr);d[c].rotate&&i.rotate(d[c].rotate);i=i.getBBox();Math.sqrt(i.height*i.height+i.width*i.width)}},draw:function(d){var c,i;if(d.type=="line")c=this.svg.path(["M",d.x1,d.y1,"L",d.x2,d.y2]).attr(Smits.PhyloCanvas.Render.Style.line);else if(d.type=="path")c=this.svg.path(d.path).attr(d.attr);else if(d.type=="circle")c=this.svg.circle(d.x,d.y,d.radius).attr({stroke:"red"});else if(d.type=="text"){c=this.svg.text(d.x,d.y,d.text).attr(Smits.PhyloCanvas.Render.Style.text);d.attr&&c.attr(d.attr);
d.rotate&&c.rotate(d.rotate);d=c.getBBox();i=Math.sqrt(d.height*d.height+d.width*d.width)}return[c,i]}};
Smits.PhyloCanvas.Render.Phylogram=function(){function d(n,r,q,w){return["M",n,r,"L",q,r,"L",q,w,"L",n,w,"Z"]}function c(n,r){if(n.len)if(h)h=false;else if(n.children.length==0)a=Smits.Common.roundFloat(a+F,4);if(n.children.length>0){var q=[],w,v,A,B;if(n.len){w=r;v=r=Smits.Common.roundFloat(r+u*n.len,4);B=A=a+(1+n.getCountAllChildren())*F/2;t.draw(new Smits.PhyloCanvas.Render.Line(w,v,A,B))}n.name&&t.draw(new Smits.PhyloCanvas.Render.Text(v+5,B,n.name));if(n.children&&n.children.length)for(v=0;v<
n.children.length;v++)q.push(c(n.children[v],r));n=[];for(v=0;v<q.length;v++){q[v][0]&&n.push(q[v][0]);q[v][1]&&n.push(q[v][1])}q=Math.min.apply(null,n);n=Math.max.apply(null,n);t.draw(new Smits.PhyloCanvas.Render.Path(["M",r+1.0E-4,q,"L",r,q,"L",r,n,"L",r+1.0E-4,n]))}else{w=r;v=Smits.Common.roundFloat(r+u*n.len,2);B=A=a;n.y=a;G.push(n);t.draw(new Smits.PhyloCanvas.Render.Line(w,v,A,B));b.alignRight&&t.draw(new Smits.PhyloCanvas.Render.Path(["M",v,A,"L",f,B],{attr:Smits.PhyloCanvas.Render.Style.connectedDash}));
if(n.name){r={};r["text-anchor"]="start";if(n.uri)r.href=n.uri;if(n.description)r.title=n.description;r=t.draw(new Smits.PhyloCanvas.Render.Text(b.alignRight?f+b.bufferInnerLabels:v+b.bufferInnerLabels,B,n.name,{attr:r}));e=Math.max(r[1],e);Smits.PhyloCanvas.Render.Parameters.mouseRollOver&&Smits.Common.addEventHandler(r[0].node,"mouseover",Smits.PhyloCanvas.Render.Parameters.mouseRollOver,{svg:t,node:n,x:v,y:B,textEl:r[0]});Smits.PhyloCanvas.Render.Parameters.mouseRollOut&&Smits.Common.addEventHandler(r[0].node,
"mouseout",Smits.PhyloCanvas.Render.Parameters.mouseRollOut,{svg:t,node:n,x:v,y:B,textEl:r[0]});Smits.PhyloCanvas.Render.Parameters.onClickAction&&Smits.Common.addEventHandler(r[0].node,"mouseout",Smits.PhyloCanvas.Render.Parameters.onClickAction,{svg:t,node:n,x:v,y:B,textEl:r[0]})}}return[A,B]}function i(n,r,q){var w=(q&&q.bufferInner?q.bufferInner:0)|Smits.PhyloCanvas.Render.Parameters.binaryChartBufferInner,v=(q&&q.bufferSiblings?q.bufferSiblings*F:0)|(Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings<
1?F*Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings:Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings);q=(q&&q.thickness?q.thickness:0)|Smits.PhyloCanvas.Render.Parameters.binaryChartThickness;for(var A=0;A<G.length;A++){var B=G[A];t.draw(new Smits.PhyloCanvas.Render.Path(d(n+w,B.y-F/2+v/2,n+w+q,B.y+F/2-v/2),{attr:Smits.PhyloCanvas.Render.Style.getStyle(B.chart[r],"textSecantBg")}))}return n+w+q}function p(n,r,q){var w=[],v=q&&q.bufferInner?q.bufferInner:0|Smits.PhyloCanvas.Render.Parameters.barChartBufferInner,
A=q&&q.height?q.height:0|Smits.PhyloCanvas.Render.Parameters.barChartHeight;q=q&&q.width?q.width<1?F*q.width:q.width:0|(Smits.PhyloCanvas.Render.Parameters.barChartWidth<1?F*Smits.PhyloCanvas.Render.Parameters.barChartWidth:Smits.PhyloCanvas.Render.Parameters.barChartWidth);for(var B=0,H=0;H<G.length;H++)w.push(G[H].chart[r]);w=Math.max.apply(null,w);B=Smits.Common.roundFloat(A/w,4);for(H=0;H<G.length;H++){w=G[H];t.draw(new Smits.PhyloCanvas.Render.Path(d(n+v,w.y-q/2,n+v+B*w.chart[r],w.y+q/2),{attr:Smits.PhyloCanvas.Render.Style.getStyle(w.chart[r],
"barChart")}))}return n+v+A}var t,b=Smits.PhyloCanvas.Render.Parameters.Rectangular,y,g,u,F,f,m,h=true,a=0,e=0,l,x,G=[];return function(n,r){this.getCanvasSize=function(){return[y,g]};this.getRoot=function(){return r.getRoot()};r.getValidate()&&t.draw(0,0,r.getValidate());t=n;n=r.getRoot();var q=r.getNewickLen();y=t.canvasSize[0];g=t.canvasSize[1];l=b.bufferX;x=b.bufferY;m=b.minHeightBetweenLeaves;u=Math.round((y-l)/q);F=Math.round((g-x)/n.getCountAllChildren());if(F<m)F=m;f=Math.round(y-l);if(Smits.PhyloCanvas.Render.Parameters.binaryCharts.length||
Smits.PhyloCanvas.Render.Parameters.barCharts.length)b.alignRight=true;c(n,0);outerX=f+e+b.bufferInnerLabels;if(Smits.PhyloCanvas.Render.Parameters.binaryCharts.length){n=Smits.PhyloCanvas.Render.Parameters.binaryCharts;for(var w in n)outerX=i(outerX,n[w].chart,n[w])}if(Smits.PhyloCanvas.Render.Parameters.barCharts.length){n=Smits.PhyloCanvas.Render.Parameters.barCharts;for(w in n)outerRadius=p(outerX,n[w].chart,n[w])}}}();Smits.PhyloCanvas.Render.Phylogram.prototype={};
Smits.PhyloCanvas.Render.CircularPhylogram=function(){function d(k,o){o+=L;return[Smits.Common.roundFloat(q+k*Math.sin(o*M),4),Smits.Common.roundFloat(w+k*Math.cos(o*M),4)]}function c(k,o,j,s){var z=d(k,o),D=d(k,j),E=[],C=0;o=Math.abs(p(j-o))>180?1:-1;if(s&&s.invertSecant){o*=-1;C=1}s&&s.noMove||E.push("M");E.push(z[0],z[1],"A",k,k,0,o<1?0:1,C,D[0],D[1]);return E}function i(k,o,j,s){var z=[];o=d(o,k);k=d(j,k);s&&s.noMove||z.push("M");z.push(o[0],o[1],"L",k[0],k[1]);return z}function p(k){for(;k>360||
k<0;)if(k>360)k-=360;else if(k<0)k+=360;return k}function t(k,o,j,s){return y("M",c(k,j,s,{noMove:1,invertSecant:0}),"L",c(o,s,j,{noMove:1,invertSecant:1}),"Z")}function b(k,o){o=o;if(k.len)if(n){r=B|1;n=false}else if(k.children.length==0)r=Smits.Common.roundFloat(r+x,4);if(k.children.length>0){var j=[],s,z,D;s=o;z=o+=Smits.Common.roundFloat(l*k.len,4);if(k.children&&k.children.length)for(var E=0;E<k.children.length;E++){var C=b(k.children[E],o);C>0&&j.push(C)}E=Smits.Common.roundFloat(Math.min.apply(null,
j),4);j=Smits.Common.roundFloat(Math.max.apply(null,j),4);f.draw(new Smits.PhyloCanvas.Render.Path(y("M",d(o+0.01,E),"L",c(o,E,j,{noMove:true}),"L",d(o+0.01,j))));if(k.len){D=Smits.Common.roundFloat(E+(j-E)/2,4);f.draw(new Smits.PhyloCanvas.Render.Path(i(D,s,z)))}}else{k.y=r;A.push(k);s=o;z=Smits.Common.roundFloat(o+l*k.len);D=r;f.draw(new Smits.PhyloCanvas.Render.Path(i(D,s,z)));f.draw(new Smits.PhyloCanvas.Render.Path(i(D,z,v),{attr:Smits.PhyloCanvas.Render.Style.connectedDash}));if(k.name){o=d(v+
m.bufferInnerLabels,D);s=p(91-D-L);if(s>90&&s<270){s+=180;alignment="end"}else alignment="start";j={};j["text-anchor"]=alignment;if(k.uri)j.href=k.uri;if(k.description)j.title=k.description;s=f.draw(new Smits.PhyloCanvas.Render.Text(o[0],o[1],k.name,{attr:j,rotate:[s,o[0],o[1]]}));o=d(z,D);Smits.PhyloCanvas.Render.Parameters.mouseRollOver&&Smits.Common.addEventHandler(s[0].node,"mouseover",Smits.PhyloCanvas.Render.Parameters.mouseRollOver,{svg:f,node:k,x:o[0],y:o[1],textEl:s[0]});Smits.PhyloCanvas.Render.Parameters.mouseRollOut&&
Smits.Common.addEventHandler(s[0].node,"mouseout",Smits.PhyloCanvas.Render.Parameters.mouseRollOut,{svg:f,node:k,x:o[0],y:o[1],textEl:s[0]});Smits.PhyloCanvas.Render.Parameters.onClickAction&&Smits.Common.addEventHandler(s[0].node,"click",Smits.PhyloCanvas.Render.Parameters.onClickAction,{svg:f,node:k,x:o[0],y:o[1],textEl:s[0]});K=Math.max(s[1],K)}}return D}function y(k){for(var o=k,j=1;j<arguments.length;j++)o=o.concat(arguments[j]);return o}function g(){var k=[];k=t(v,v+K+m.bufferOuterLabels,(B|
1)+x/2,360+x/2+0.999);f.draw(new Smits.PhyloCanvas.Render.Path(k,{attr:Smits.PhyloCanvas.Render.Style.textSecantBg}))[0].toBack();return v+K+m.bufferOuterLabels}function u(k,o,j){var s=(j&&j.bufferInner?j.bufferInner:0)|Smits.PhyloCanvas.Render.Parameters.binaryChartBufferInner,z=(j&&j.bufferSiblings?j.bufferSiblings*x:0)|(Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings<1?x*Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings:Smits.PhyloCanvas.Render.Parameters.binaryChartBufferSiblings),
D=(j&&j.thickness?j.thickness:0)|Smits.PhyloCanvas.Render.Parameters.binaryChartThickness;j=(j&&j.disjointed?j.disjointed:false)|Smits.PhyloCanvas.Render.Parameters.binaryChartDisjointed;for(var E=true,C,I=0;I<A.length;I++){var J=A[I];if(!A[I+1]||J.chart[o]!==A[I+1].chart[o]||j){f.draw(new Smits.PhyloCanvas.Render.Path(t(k+s,k+s+D,(C?C:J.y)-x/2+(E&&!j?0:z/2),J.y+x/2-(I==A.length-1&&!j?0:z/2)),{attr:Smits.PhyloCanvas.Render.Style.getStyle(J.chart[o],"textSecantBg")}));C=0}else if(!C)C=J.y;E=false}return k+
s+D}function F(k,o,j){var s=[],z=j&&j.bufferInner?j.bufferInner:0|Smits.PhyloCanvas.Render.Parameters.barChartBufferInner,D=j&&j.height?j.height:0|Smits.PhyloCanvas.Render.Parameters.barChartHeight;j=j&&j.width?j.width<1?x*j.width:j.width:0|(Smits.PhyloCanvas.Render.Parameters.barChartWidth<1?x*Smits.PhyloCanvas.Render.Parameters.barChartWidth:Smits.PhyloCanvas.Render.Parameters.barChartWidth);for(var E=0,C=0;C<A.length;C++)s.push(A[C].chart[o]);s=Math.max.apply(null,s);E=Smits.Common.roundFloat(D/
s,4);for(C=0;C<A.length;C++){s=A[C];f.draw(new Smits.PhyloCanvas.Render.Path(t(k+z,k+z+E*s.chart[o],s.y-j/2,s.y+j/2),{attr:Smits.PhyloCanvas.Render.Style.getStyle(s.chart[o],"barChart")}))}return k+z+D}var f,m=Smits.PhyloCanvas.Render.Parameters.Circular,h,a,e,l,x,G,n=true,r=0,q,w,v,A=[],B,H,K=0,L,M=Math.PI/180;return function(k,o,j){this.getCanvasSize=function(){return[h,a]};this.getRoot=function(){return o.getRoot()};if(o.getValidate())k.draw({type:"text",x:0,y:k.canvasSize[1]/3,text:o.getValidate()});
else{f=k;k=o.getRoot();var s=o.getNewickLen();h=f.canvasSize[0];a=f.canvasSize[1];q=h/2;w=a/2;e=Math.min.apply(null,[h,a]);j=m.bufferRadius>1?m.bufferRadius:Smits.Common.roundFloat(e*m.bufferRadius,4);B=m.bufferAngle;G=m.innerCircleRadius;L=m.initStartAngle;v=Math.round((e-j-G)/2);l=(v-G)/s;x=Smits.Common.roundFloat((360-B)/k.getCountAllChildren(),4);b(k,G);H=g();if(Smits.PhyloCanvas.Render.Parameters.binaryCharts.length){j=Smits.PhyloCanvas.Render.Parameters.binaryCharts;for(var z in j)H=u(H,j[z].chart,
j[z])}if(Smits.PhyloCanvas.Render.Parameters.barCharts.length){j=Smits.PhyloCanvas.Render.Parameters.barCharts;for(z in j)H=F(H,j[z].chart,j[z])}}}}();Smits.PhyloCanvas.Render.CircularPhylogram.prototype={};
var XMLObjectifier=function(){var d=function(c){var i="";if(c&&typeof c==="string")i=c;return/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/.test(i)};return{xmlToJSON:function(c){try{if(!c)return null;var i={};i.typeOf="JSXBObject";var p=c.nodeType==9?c.documentElement:c;i.RootName=p.nodeName||"";if(c.nodeType==3||c.nodeType==4)return c.nodeValue;var t=function(f){return f.replace(/^\s+|\s+$/gm,"")},b=function(f){return String(f).replace(/-/g,"_")},y=function(f,m){if(m.attributes.length>0){var h=m.attributes.length-
1,a;f._attributes=[];do{a=String(b(m.attributes[h].name));f._attributes.push(a);f[a]=t(m.attributes[h].value)}while(h--)}};(function(){return{activate:function(){var f=[];if(f){f.getNodesByAttribute=function(m,h){if(f&&f.length>0){var a=[],e,l=f.length-1;try{do{e=f[l];e[m]===h&&a.push(e)}while(l--);a.reverse();return a}catch(x){return null}}};f.getNodeByAttribute=function(m,h){if(f&&f.length>0){var a,e=f.length-1;try{do{a=f[e];if(a[m]===h)return a}while(e--)}catch(l){return null}return null}};f.getNodesByValue=
function(m){if(f&&f.length>0){var h=[],a,e=f.length-1;try{do{a=f[e];a.Text&&a.Text===m&&h.push(a)}while(e--);return h}catch(l){return null}}};f.contains=function(m,h){if(f&&f.length>0){var a=f.length-1;try{do if(f[a][m]===h)return true;while(a--)}catch(e){return false}return false}};f.indexOf=function(m,h){var a=-1;if(f&&f.length>0){var e=f.length-1;try{do if(f[e][m]===h)a=e;while(e--)}catch(l){return-1}return a}};f.SortByAttribute=function(m,h){if(f&&f.length>0){var a=function(e,l){e=e[l];return e=
bam.validation.isNumeric(e)?parseFloat(e):e};f.sort(function(e,l){e=a(e,m);l=a(l,m);l=e<l?-1:l<e?1:0;if(h)l=h.toUpperCase()==="DESC"?0-l:l;return l})}};f.SortByValue=function(m){if(f&&f.length>0){var h=function(a){a=a.Text;return a=bam.validation.isNumeric(a)?parseFloat(a):a};f.sort(function(a,e){a=h(a);e=h(e);e=a<e?-1:e<a?1:0;if(m)e=m.toUpperCase()==="DESC"?0-e:e;return e})}};f.SortByNode=function(m,h){if(f&&f.length>0){var a=function(e,l){e=e[l][0].Text;return e=bam.validation.isNumeric(e)?parseFloat(e):
e};f.sort(function(e,l){e=a(e,m);l=a(l,m);l=e<l?-1:l<e?1:0;if(h)l=h.toUpperCase()==="DESC"?0-l:l;return l})}}}return f}}})();var g=function(f){f.getNodeByAttribute=function(m,h){if(this.length>0){var a,e=this.length-1;try{do{a=this[e];if(a[m]==h)return a}while(e--)}catch(l){return false}return false}};f.contains=function(m,h){if(this.length>0){var a=this.length-1;try{do if(this[a][m]==h)return true;while(a--)}catch(e){return false}return false}};f.indexOf=function(m,h){var a=-1;if(this.length>0){var e=
this.length-1;try{do if(this[e][m]==h)a=e;while(e--)}catch(l){return-1}return a}};f.SortByAttribute=function(m,h){if(this.length){var a=function(e,l){e=e[l];return e=d(e)?parseFloat(e):e};this.sort(function(e,l){var x=0;e=a(e,m);l=a(l,m);if(e<l)x=-1;else if(l<e)x=1;if(h)x=h.toUpperCase()=="DESC"?0-x:x;return x})}};f.SortByValue=function(m){if(this.length){var h=function(a){a=a.Text;return a=d(a)?parseFloat(a):a};this.sort(function(a,e){var l=0;a=h(a);e=h(e);if(a<e)l=-1;else if(e<a)l=1;if(m)l=m.toUpperCase()==
"DESC"?0-l:l;return l})}};f.SortByNode=function(m,h){if(this.length){var a=function(e,l){e=e[l][0].Text;return e=d(e)?parseFloat(e):e};this.sort(function(e,l){var x=0;e=a(e,m);l=a(l,m);if(e<l)x=-1;else if(l<e)x=1;if(h)x=h.toUpperCase()=="DESC"?0-x:x;return x})}}},u=function(f,m){var h,a,e,l="";if(!m)return null;m.attributes.length>0&&y(f,m);f.Text="";if(m.hasChildNodes()){var x=m.childNodes.length-1,G=0;do{a=m.childNodes[G];switch(a.nodeType){case 1:f._children=[];h=a.localName?a.localName:a.baseName;
h=b(h);l!=h&&f._children.push(h);f[h]||(f[h]=[]);e={};f[h].push(e);a.attributes.length>0&&y(e,a);f[h].contains||g(f[h]);l=h;a.hasChildNodes()&&u(e,a);break;case 3:f.Text+=t(a.nodeValue);break;case 4:f.Text+=a.text?t(a.text):t(a.nodeValue);break}}while(G++<x)}};u(i,p);p=c=null;return i}catch(F){return null}},textToXML:function(c){var i=null;try{i=document.all?new ActiveXObject("Microsoft.XMLDOM"):new DOMParser;i.async=false}catch(p){throw new Error("XML Parser could not be instantiated");}var t;try{t=
document.all?i.loadXML(c)?i:false:i.parseFromString(c,"text/xml")}catch(b){throw new Error("Error parsing XML string");}return t}}}();
