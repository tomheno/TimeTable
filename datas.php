<?php
    /*
        Edt - Lyon1 by Laurent MOREL - 2014-2015
        (Licensed under Creative Commons CC-BY-NC)
    */
    date_default_timezone_set('Europe/Paris');
    $ressourceID = 14590;
    $projectId = 2;
    $now = new DateTime();
    $firstDate =  academicYear($now)[0] . "-09-03";
    $lastDate = academicYear($now)[1] ."-06-30";

    $file = fopen("https://ade-uga.grenet.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=" . $ressourceID . "&projectId=" . $projectId . "&calType=ical&firstDate=" . $firstDate . "&lastDate=" . $lastDate . "", "r") or exit("Unable to open file!");

    $edt = array();
    /***
        A row corresponds to :
            title -> title + room
            start
            end
    ****/
    /* Tab used for coloration */
    $used_id = array(); // Contains the pair [color, title]
    // You can add many colors
    $colors = array("#588C73","#F2E394","#F2AE72","#D96459","#8C4646",);
    $colors = array_merge($colors,$colors);
    $colors = array_merge($colors,$colors);
    $colors = array_merge($colors,$colors);
    $colors = array_merge($colors,$colors);
    $current = -1;

        while(!feof($file)){
        $line = fgets($file); // separate the ""
        $l = explode(':', $line);

		if(isset($l[1])){
			        $description = trim($l[1]); // debug \n\r ... of the line
        // Create a new row
        if($l[0] == 'BEGIN' && $description == 'VEVENT'){
            $current++;
            $edt[$current]['id'] = $current;
        }
        //
        switch ($l[0]) {
            case 'DTSTART': // Event beginning (start)
                $edt[$current]['start'] = date('Y-m-d\TH:i:s', strtotime($l[1]));
                break;
            case 'DTEND': // Event end (end)
                $edt[$current]['end'] = date('Y-m-d\TH:i:s', strtotime($l[1]));
                break;
            case 'SUMMARY': // Event title (title)
                $edt[$current]['title'] = str_replace("\\", "", $l[1]);
                /*
                    Color attribution for a specific event, based on the "title"
                */
                $color_id = 0;
                $color_used = "";
                if(in_array($l[1], $used_id)){ // The  "title" corresponds already to a color
                    $color_id = array_search($l[1], $used_id);
                    $color_used = $colors[$color_id];
                }else{
                    array_push($used_id, $l[1]);
                    $color_id = array_search($l[1], $used_id);
                    $color_used = $colors[$color_id];
                }
                $edt[$current]['backgroundColor'] = $color_used; // set the color
                break;
            case 'LOCATION': // Event location (room)
                $edt[$current]['title'] .= "<br><i>".str_replace("\\", "", $l[1])."</i>";
                break;
            default:
                // Nothing special to do here :)
                break;
        }
		}

    }
    fclose($file);
    header("Content-type: text/json");
    echo json_encode($edt);

    
    function academicYear(DateTime $userDate) {
        $currentYear = $userDate->format('Y');
        $cutoff = new DateTime($userDate->format('Y') . '/07/31 23:59:59');
        if ($userDate < $cutoff) {
            return ($currentYear-1) . '/' . $currentYear;
        }
        return [$currentYear, strval($currentYear+1)];
    }
    ?>

