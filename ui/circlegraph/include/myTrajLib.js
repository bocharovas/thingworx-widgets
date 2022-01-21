function Rad(Avg){ return Avg * Math.PI / 180; }
function Point_st(L) { return  -L/2 + 10; }
function Point_end(L){ return L/2 - 10;	  }
function Radius_Prc(Prc, base) {return Prc/100 * base;}


// *** Отображения барабана и осей
function CreateCircle(canvasName, w, h , Radius_Mill, cCircle = SVG.Color.random(), cTitle = SVG.Color.random()) {

    // , cCircle = new SVG.Color('#fff')
    if(!Radius_Mill || Radius_Mill <= 0) return;
    
    const mCircle = canvasName.circle()
        .radius(Radius_Mill)
        .center(0,0)
        .fill('none')
        .addClass('mbCircle')
        .stroke({color: cCircle});

	function Point_st(L) { return  -L/2 + 10; }
	function Point_end(L){ return L/2 - 10;	  }
	
    const axis_x = [[Point_st(w), 0], [Point_end(w), 0]];
    const axis_y = [[0, Point_st(h)], [0, Point_end(h)]];

	// console.log("axis_xy: " + axis_x);

    const axisX_Line = canvasName.line(axis_x).addClass('axis_x');
    const axisY_Line = canvasName.line(axis_y).addClass('axis_y');
    
    let axisAdditional_group = canvasName.group();

    function minDR_x(Arr){ return (Arr[1][0] - Arr[0][0])/2; }; // (1) > (2)

    axisAdditional_group.line(axis_x).move(-minDR_x(axis_x), Radius_Mill).addClass('axis_x_0');
    axisAdditional_group.line(axis_y).move(-Radius_Mill, -minDR_x(axis_x)).addClass('axis_y_0');
    axisAdditional_group.line(axis_x).move(-minDR_x(axis_x), -Radius_Mill).addClass('axis_x_1');
    axisAdditional_group.line(axis_y).move(Radius_Mill, -minDR_x(axis_x)).addClass('axis_y_1');

    
    var axisAngleTitle_group = canvasName.group().addClass('axis_angle_title')
                                                 .fill({color: cTitle});
    axisAngleTitle_group.text("0")      .move( Radius_Mill * 1.05, -Radius_Mill * 0.07).addClass('title_0');
    axisAngleTitle_group.text("90")     .move( Radius_Mill * 0.05, -Radius_Mill * 1.07).addClass('title_90');
    axisAngleTitle_group.text("180")    .move(-Radius_Mill * 1.09,  Radius_Mill * 0.05).addClass('title_180');
    axisAngleTitle_group.text("270")    .move(-Radius_Mill * 0.09,  Radius_Mill * 1.05).addClass('title_270');
        
}

// *** Траектория полета шаров ***
function TrAlpha_Show(canvasName, Alp, Beta, Radius_Mill,
						Enable_trA = true,
                        trB_target = true, trB_target_Angles = [220,241],
                        trA_title  = true, cAngle_A = SVG.Color.random('dark'), 
                                           cAngle_B = SVG.Color.random('sine')) {

    Alp = Alp > 125 ? 125 :
          Alp < 0 ? 0 : Alp;
    
    Beta = Beta > 300 ? 300 :
           Beta < 125 ? 125 : Beta;      

    const Beta_GE_180 = (Beta > 180);  

    const AlpBetaAngle = [Alp, Beta];
    //const AlpBetaAngleRad = AlpBetaAngle.map(function(elem){return Rad(90 - elem);});
    const AlpBetaAngleRad = [Rad(90 - Alp), Rad(Beta)];

    const Sin_AlpBetaAngle = AlpBetaAngleRad.map(function(elem){return Math.sin(elem);});
    const Cos_AlpBetaAngle = AlpBetaAngleRad.map(function(elem){return Math.cos(elem);});


    const trPoints = {
          ps: {
                x: Radius_Mill * Math.cos(Rad(45)),
                y: Radius_Mill * Math.cos(Rad(45))
      },  p1: {   // точка А
                x: Radius_Mill * Sin_AlpBetaAngle[0],
                y: -Radius_Mill * Cos_AlpBetaAngle[0],
      }
    };
    trPoints.p2 = {   // точка A1 и Ah
                x:  Radius_Mill / 2 * (Sin_AlpBetaAngle[0] + Cos_AlpBetaAngle[1]),
//                y:  -Radius_Mill * Sin_AlpBetaAngle[0] / (2 * Cos_AlpBetaAngle[0]) * (Cos_AlpBetaAngle[0] + Cos_AlpBetaAngle[1]) - Radius_Mill / Cos_AlpBetaAngle[0],
                y:  Radius_Mill * Sin_AlpBetaAngle[0] / (2 * Cos_AlpBetaAngle[0]) * (Sin_AlpBetaAngle[0] + Cos_AlpBetaAngle[1]) - Radius_Mill / Cos_AlpBetaAngle[0]            
                // x1:  trPoints.p1.x - 2 * Radius_Mill * Sin_AlpBetaAngle[0] * Cos_AlpBetaAngle[0] * Cos_AlpBetaAngle[0],
                // y1:  trPoints.p1.y,
                // x2:  trPoints.p1.x - Radius_Mill * Sin_AlpBetaAngle[0] * Cos_AlpBetaAngle[0] * Cos_AlpBetaAngle[0],
                // y2:  - Radius_Mill/ Cos_AlpBetaAngle[0] * (1 - Math.pow(Sin_AlpBetaAngle[0],4))
    };

    // trPoints.p2 = {   // точка A1 и Ah
    //     x:  trPoints.p1.x - 2 * Radius_Mill * Sin_AlpBetaAngle[0] * Cos_AlpBetaAngle[0] * Cos_AlpBetaAngle[0],
    //     y:  trPoints.p1.y,
    //     x1: trPoints.p1.x - Radius_Mill * Sin_AlpBetaAngle[0] * Cos_AlpBetaAngle[0] * Cos_AlpBetaAngle[0],
    //     y1:  - Radius_Mill/ Cos_AlpBetaAngle[0] * (1 - Math.pow(Sin_AlpBetaAngle[0],4))
    // };

    trPoints.p3 = {   // точка B и Bh
                x: Radius_Mill * Cos_AlpBetaAngle[1],
                y: -Radius_Mill * Sin_AlpBetaAngle[1]
    };

    // trPoints.p3 = {   // точка B и Bh
    //     x: -4*Radius_Mill * Sin_AlpBetaAngle[0] * Cos_AlpBetaAngle[0] * Cos_AlpBetaAngle[0] + trPoints.p1.x,
    //     y: 4*Radius_Mill * Sin_AlpBetaAngle[0] * Sin_AlpBetaAngle[0] * Cos_AlpBetaAngle[0] + trPoints.p1.y,
    //     x1: -Radius_Mill * Sin_AlpBetaAngle[0] *(3 - 4 * Math.pow(Sin_AlpBetaAngle[0],2)),
    //     y1: -Radius_Mill * (1 - 2 * Math.pow(Sin_AlpBetaAngle[0],2)) * Cos_AlpBetaAngle[0]
    // };



    // **  Касательные к точке А
/*  
    let XAlp_Line = canvasName.line(Radius_Mill / Sin_AlpBetaAngle[0], 0, 0, - Radius_Mill / Cos_AlpBetaAngle[0]).stroke({
      opacity: 1.0,
      width: 0.2,
      dasharray: [1, 1],
      color: SVG.Color.random()
    });

    let X_1Alp_Line_x =  Radius_Mill / Sin_AlpBetaAngle[0] * (Cos_AlpBetaAngle[0]  + 1 - 2 * Math.pow(Sin_AlpBetaAngle[0],4));

    let X_1Alp_Line = canvasName.line(trPoints.p2.x1, trPoints.p2.y1, -X_1Alp_Line_x, Radius_Mill).stroke({
      opacity: 1.0,
      width: 0.2,
      dasharray: [1, 1],
      color: SVG.Color.random()
    });
  */
    // ++  Касательные к точке А

    // const trajectoryPoint = new SVG.PathArray([
    //     ['M',  trPoints.ps.x, trPoints.ps.y]                                             // Стартовая точка: 1
    //     ,['A', Radius_Mill, Radius_Mill, 0, 0, 0, trPoints.p1.x, trPoints.p1.y]          // Точка: 2
    //     ,['Q', trPoints.p2.x2, trPoints.p2.y2, trPoints.p2.x1, trPoints.p1.y]             // Точка: 4
    // //    ,['Q', trPoints.p2.x, trPoints.p2.y, trPoints.p3.x, trPoints.p3.y]             // Точка: 4
    // //    ,['Q', trPoints.p3.x1, trPoints.p3.y1, trPoints.p3.x, trPoints.p3.y]             // Точка: 4
    //     ,['A', -Radius_Mill, Radius_Mill, 0, 0, 0, trPoints.ps.x, trPoints.ps.y]
    //     ,['z']
    // ]);

    const trajectoryPoint = new SVG.PathArray([
        ['M',  trPoints.ps.x, trPoints.ps.y]                                             // Стартовая точка: 1
        ,['A', Radius_Mill, Radius_Mill, 0, 0, 0, trPoints.p1.x, trPoints.p1.y]          // Точка: 2
        ,['Q', trPoints.p2.x, trPoints.p2.y, trPoints.p3.x, trPoints.p3.y]             // Точка: 4
    //    ,['Q', trPoints.p3.x1, trPoints.p3.y1, trPoints.p3.x, trPoints.p3.y]             // Точка: 4
        ,['A', -Radius_Mill, Radius_Mill, 0, 0, 0, trPoints.ps.x, trPoints.ps.y]
        ,['z']
    ]);

    if(Enable_trA) {

        // *** AlphaAngle  

        const Alp_Line = canvasName.line(0, 0, trPoints.p1.x, trPoints.p1.y).addClass('Alp_Line');
        const Nil_Line = canvasName.line(0, 0, Radius_Mill, 0).addClass('Nil_Line');

        let trajectoryPath = canvasName.path(trajectoryPoint).addClass('trajectoryPath_A')
                                       .fill({ color: SVG.Color.random()})
                                       .stroke({ color: SVG.Color.random() });
        
        
        const kAlpha = 0.12;
        let trAlpAngle = new SVG.PathArray([
         ['M', kAlpha * Radius_Mill, 0]                                             // Стартовая точка: 1
        ,['A', kAlpha * Radius_Mill, kAlpha * Radius_Mill, 0, 0, 0, kAlpha * trPoints.p1.x, kAlpha * trPoints.p1.y]
        ,['L', 0, 0]
        ,['z']
        ]);
        
        // ++ Alpha *** Beta
        const kBeta = 0.18;
        let trBetaAngle = new SVG.PathArray([
         ['M', kBeta * Radius_Mill, 0]                                             // Стартовая точка: 1
        ,['A', kBeta * Radius_Mill, kBeta * Radius_Mill, 1, Beta_GE_180?1:0, 0, kBeta * trPoints.p3.x, kBeta * trPoints.p3.y]
        ,['L', 0, 0]
        ,['z']
        ]);
        
        // ++ Beta
        let Beta_Line = canvasName.line(0, 0, trPoints.p3.x, trPoints.p3.y).addClass('Beta_Line');

        // *** titles *** 
      if(trA_title === true) {
        
        const delta = kAlpha * 1.7 * Radius_Mill;
        var axisAngleTitle_group = canvasName.group();
        axisAngleTitle_group.path(trBetaAngle).addClass('trBetaAnglePath').fill({ color: cAngle_B});
        axisAngleTitle_group.path(trAlpAngle).addClass('trAlpAnglePath').fill({ color: cAngle_A});
        axisAngleTitle_group.text("A").addClass('axis_angle_Alpha_title').fill(cAngle_A).move(delta, -delta/2);
        axisAngleTitle_group.text("B").addClass('axis_angle_Betta_title').fill(cAngle_A)
                            .move(trPoints.p3.x * kBeta - Radius_Mill * 0.07, trPoints.p3.y * kBeta * 1.2 );
      }
    
        // *** Target Area
      if(trB_target) {
		
            const TargetAngle = trB_target_Angles;
            const TargetAngleRad = TargetAngle.map(function(elem){return Rad(90 - elem);});
            
            const Sin_TargetAngle = TargetAngleRad.map(function(elem){return Math.sin(elem);});
            const Cos_TargetAngle = TargetAngleRad.map(function(elem){return -Math.cos(elem);});

        //  	console.log(Sin_TargetAngle);

            if(TargetAngle.length > 1) {
                let trTargetArea = new SVG.PathArray([
                 ['M', 0.94 * Radius_Mill * Sin_TargetAngle[0], 0.94 * Radius_Mill * Cos_TargetAngle[0]]
                ,['L', Radius_Mill * Sin_TargetAngle[0], Radius_Mill * Cos_TargetAngle[0]]                                             // Стартовая точка: 1
                ,['A', Radius_Mill, Radius_Mill, 0, 0, 0, Radius_Mill * Sin_TargetAngle[1], Radius_Mill * Cos_TargetAngle[1]]
                ,['L', 0.94 * Radius_Mill * Sin_TargetAngle[1], 0.94 * Radius_Mill * Cos_TargetAngle[1]]
                ]);          

                const trTargetPath = canvasName.path(trTargetArea).addClass('trTargetPath');
            }      
        }
    }
}   //  end -- func CreateCircle()

// Удаляем элементы траектории
function TrAlpha_Remove() {
    SVG.find('.trajectoryPath_A').remove();
    SVG.find('.Alp_Line').remove();
    SVG.find('.Beta_Line').remove();
    SVG.find('.trBetaAnglePath').remove();
    SVG.find('.trAlpAnglePath').remove();
    SVG.find('.axis_angle_Alpha_title').remove();
    SVG.find('.axis_angle_Betta_title').remove();

    SVG.find('.trTargetPath').remove();
}


// *** Положение центра Масс и центра ***
function CoC_Show(canvasName, Ang_CoC, Rad_CoC, 
                    Enable_Show_CoC = true,
                    cAngle_CoC = SVG.Color.random('rgb'),
                    cAngle_Title = SVG.Color.random('dark'),
                    CoC_CoM_title = true) {
    
  

    const Angle_CoC_Rad = Rad(180 - Ang_CoC);

    const Angle_SinCos = {
        CoC: {
                sin: Math.sin(Angle_CoC_Rad),
                cos: -Math.cos(Angle_CoC_Rad)
        }
    } 

    const trPointsMass = {
            CoC: {
                x: Rad_CoC * Angle_SinCos.CoC.sin,
                y: Rad_CoC * Angle_SinCos.CoC.cos
        }
    };
     
    const k_CoC = 0.1
    
    if(Enable_Show_CoC) {
        let CoC_Line = canvasName.line(0, 0, trPointsMass.CoC.x, trPointsMass.CoC.y)
                            .addClass('CoC_Line').stroke({ color: cAngle_CoC });

        let CoC_Arrow = canvasName.polygon([
                [trPointsMass.CoC.x, trPointsMass.CoC.y]
                ,[-0.3 * k_CoC * Rad_CoC + trPointsMass.CoC.x, 0.8 * k_CoC * Rad_CoC + trPointsMass.CoC.y]
                ,[ 0.3 * k_CoC * Rad_CoC + trPointsMass.CoC.x, 0.8 * k_CoC * Rad_CoC + trPointsMass.CoC.y]])
            .addClass('CoC_Arrow')
            .fill(SVG.Color.random()).stroke(cAngle_CoC)
        //    .dx(trPointsMass.CoC.x).dy(trPointsMass.CoC.y)
            .rotate(180 - Ang_CoC, trPointsMass.CoC.x, trPointsMass.CoC.y);  
    }

    // *** Titles ***
    if(CoC_CoM_title) {
        // *** Angle CoC ***

        const kAlpha = 0.12;

        let trRadius_CoCAngle = new SVG.PathArray([
            ['M', 0, kAlpha *  Rad_CoC]                                             // Стартовая точка: 1
            ,['A', kAlpha *  Rad_CoC, kAlpha *  Rad_CoC, 0, 0, 0, kAlpha * trPointsMass.CoC.x, kAlpha * trPointsMass.CoC.y]
            ,['L', 0, 0]
            ,['z']
            ]);

        if(Enable_Show_CoC) {
            let trRadius_CoCPath = canvasName.path(trRadius_CoCAngle).addClass('trRadius_CoCPath')
                .fill({ color: SVG.Color.random() }).stroke({ color: cAngle_CoC });

            var Radius_CoC_Title = canvasName.text("CoC").addClass('Radius_CoC_Title').fill(cAngle_CoC)
                .move(trPointsMass.CoC.x/2 -  Rad_CoC * k_CoC*2, trPointsMass.CoC.y/2);
        }
    }  
}   //  end -- func CoC_Show()

function CoC_Remove() {
    SVG.find('.CoC_Line').remove();
    SVG.find('.CoC_Arrow').remove();
    SVG.find('.trRadius_CoCPath').remove();
    SVG.find('.Radius_CoC_Title').remove();
}


function CoM_Show(canvasName, Ang_CoM, Rad_CoM,
                    Enable_Show_CoM = true,
                    cAngle_CoM = SVG.Color.random('rgb'),
                    cAngle_Title = SVG.Color.random('dark'),
                    CoC_CoM_title = true) {
    
    const Angle_CoM_Rad = Rad(180 - Ang_CoM);

    const Angle_SinCos = {
        CoM: {   // точка А
                sin: Math.sin(Angle_CoM_Rad),
                cos: -Math.cos(Angle_CoM_Rad)
        }
    } 

    const trPointsMass = {
        CoM: {   // точка А
                x: Rad_CoM * Angle_SinCos.CoM.sin,
                y: Rad_CoM * Angle_SinCos.CoM.cos 
        }
    };
    
    const k_CoM = 0.15;
    
    if(Enable_Show_CoM) {
        let CoM_Line = canvasName.line(0, 0, trPointsMass.CoM.x, trPointsMass.CoM.y)
                            .addClass('CoM_Line').stroke({ color: cAngle_CoM });

        let CoM_Arrow = canvasName.polygon([
                [ trPointsMass.CoM.x, trPointsMass.CoM.y ]
                ,[-0.3 * k_CoM *  Rad_CoM + trPointsMass.CoM.x, 0.8 * k_CoM * Rad_CoM  + trPointsMass.CoM.y ]
                ,[ 0.3 * k_CoM *  Rad_CoM + trPointsMass.CoM.x, 0.8 * k_CoM * Rad_CoM  + trPointsMass.CoM.y]])
            .addClass('CoM_Arrow')
            .fill({ color: SVG.Color.random('vibrant') }).stroke({ color: cAngle_CoM })
    //        .dx(trPointsMass.CoM.x).dy(trPointsMass.CoM.y).
            .rotate(180 -  Ang_CoM, trPointsMass.CoM.x, trPointsMass.CoM.y); 
    }
    // *** Titles ***
    if(CoC_CoM_title) {
        // *** Angle CoM ***
        const kBeta = 0.18;
        
        let trRadius_CoMAngle = new SVG.PathArray([
            ['M', 0, kBeta *  Rad_CoM]                                             // Стартовая точка: 1
            ,['A', kBeta *  Rad_CoM, kBeta *  Rad_CoM, 0, 0, 0, kBeta * trPointsMass.CoM.x, kBeta * trPointsMass.CoM.y]
            ,['L', 0, 0]
            ,['z']
            ]);
        
        if(Enable_Show_CoM) {
            let trRadius_CoMPath = canvasName.path(trRadius_CoMAngle).addClass('trRadius_CoMPath')
                .fill({ color: SVG.Color.random() }).stroke({ color: cAngle_CoM });



            var Radius_CoM_Title = canvasName.text("CoM").addClass('Radius_CoM_Title').fill(cAngle_CoM)
                .move(trPointsMass.CoM.x/2 +  Rad_CoM * k_CoM/2, trPointsMass.CoM.y/2 -  Rad_CoM * k_CoM/2);
        }
    }  
}

function CoM_Remove() {
    SVG.find('.CoM_Line').remove();
    SVG.find('.CoM_Arrow').remove();
    SVG.find('.trRadius_CoMPath').remove();
    SVG.find('.Radius_CoM_Title').remove();
}

// ***** Napier-Munn ******
function NapMunn_Show(canvasName, Tetta_S, Tetta_T, Ri, Radius_Mill,
						Enable_trNapMunn = true,  
                        NapMunn_title = true) {

    const BigAngle =    (Tetta_T - Tetta_S < 180) && (Tetta_S >= 0) && (Tetta_S <= 90) ? 1:
                        (Tetta_T - Tetta_S < 180) && (Tetta_S >= 90) && (Tetta_S <= 180) ? 1:
                        (Tetta_T - Tetta_S > 180) && (Tetta_S >= 0) && (Tetta_S <= 90) ? 0: 0;

    const Tetta_Angles = [ Rad(Tetta_S), Rad(Tetta_T) ];

    const Tetta_SinCos = {
        Tetta_S: { 
            sin: Math.sin(Tetta_Angles[0]),
            cos: Math.cos(Tetta_Angles[0])
        },
        Tetta_T: {
            sin: Math.sin(Tetta_Angles[1]),
            cos: Math.cos(Tetta_Angles[1])
        }
      }

    const trPointsNapMunn = {
          ps: {   // Qtetta_T
                x: Radius_Mill * Tetta_SinCos.Tetta_T.cos,
                y: -Radius_Mill * Tetta_SinCos.Tetta_T.sin
      },  p1: {   // Qtetta_S
                x: Radius_Mill * Tetta_SinCos.Tetta_S.cos,
                y: -Radius_Mill * Tetta_SinCos.Tetta_S.sin 
      },  p2: {   // Qtetta_S -> Ri
                x: Ri * Tetta_SinCos.Tetta_S.cos,
                y: -Ri * Tetta_SinCos.Tetta_S.sin     
      },  p3: {   // Qtetta_T -> Ri
                x: Ri * Tetta_SinCos.Tetta_T.cos,
                y: -Ri * Tetta_SinCos.Tetta_T.sin
      } 
    };

    // BigAngle

    let trajectoryPointNapMunn = new SVG.PathArray([
    ['M', trPointsNapMunn.ps.x, trPointsNapMunn.ps.y]                                             // Стартовая точка: 1
    ,['A', Radius_Mill, Radius_Mill, 0, BigAngle, 0, trPointsNapMunn.p1.x, trPointsNapMunn.p1.y]   // Qtetta_S
    ,['L', trPointsNapMunn.p2.x, trPointsNapMunn.p2.y]                                             // Qtetta_S -> Ri
    ,['A', Ri, Ri, 0, BigAngle, 1, trPointsNapMunn.p3.x, trPointsNapMunn.p3.y]                     // Qtetta_T -> Ri
    ,['z']                                                                                         // Qtetta_T
    ]);

    if(Enable_trNapMunn) {

        const trajectoryPathNapMunn = canvasName.path(trajectoryPointNapMunn).addClass('trajectoryPathNapMunn')
          									  .fill(SVG.Color.random()).stroke(SVG.Color.random());

        if(NapMunn_title) {
            let Tetta_T_Line = canvasName.line(trPointsNapMunn.p3.x, trPointsNapMunn.p3.y, 1.05 * trPointsNapMunn.ps.x, 1.05 * trPointsNapMunn.ps.y)
                .addClass('Tetta_T_Line');
            let Tetta_S_Line = canvasName.line(trPointsNapMunn.p2.x, trPointsNapMunn.p2.y, 1.05 * trPointsNapMunn.p1.x, 1.05 * trPointsNapMunn.p1.y)
                .addClass('Tetta_S_Line');

            var Qt_Point_Title = canvasName.text("Qt").addClass('Qt_Title').move(1.05 * trPointsNapMunn.ps.x, 1.05 * trPointsNapMunn.ps.y).dx(0).dy(0);
            var Qs_Point_Title = canvasName.text("Qs").addClass('Qs_Title').move(1.05 * trPointsNapMunn.p1.x, 1.05 * trPointsNapMunn.p1.y);
        }    
    }
} // end -- func NapMunn_Show()

function NapMunn_Remove() {
    SVG.find('.trajectoryPathNapMunn').remove();
    SVG.find('.Tetta_T_Line').remove();
    SVG.find('.Tetta_S_Line').remove();
    SVG.find('.Qt_Title').remove();
    SVG.find('.Qs_Title').remove();
}
