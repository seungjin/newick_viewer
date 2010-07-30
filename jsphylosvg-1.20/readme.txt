This software is distributed under the GPL License.

Copyright (c) Samuel Smits, samsmits@gmail.com
All rights reserved.

If you use this software, please cite:
Samuel Smits and Cleber Ouverney. jsPhyloSVG: a Javascript Library for Visualizing Interactive and Vector-based Phylogenetic Trees on the Web.


Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
Neither the name of the Samuel Smits nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.



DOCUMENTATION
-------------
Available on our site, www.jsPhyloSVG.com


INSTALLATION NOTES
------------------
jsPhyloSVG leverages two popular libraries: YUI Library and Raphael. These need to be included in your HTML.
Here is an example of an HTML skeleton with the includes:

<html>
<head>				
	<script type="text/javascript" src="js/raphael/raphael-min.js" ></script> 
	<script type="text/javascript" src="js/yui/build/yui/yui.js"></script> 				
	<script type="text/javascript" src="js/jsphylosvg-min.js"></script> 				
</head>
<body>
	<div id="svgCanvas"> </div>
</body>
</html>		