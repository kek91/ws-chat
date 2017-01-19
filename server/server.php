#!/usr/bin/env php
<?php

require_once('./websockets.php');

class ChatServer extends WebSocketServer {
  //protected $maxBufferSize = 1048576; //1MB... overkill for an echo server, but potentially plausible for other applications.

  protected function process ($user, $message) {
    if($message) {
        $msg = json_decode($message);
        foreach($this->users as $u) {
            $message = htmlspecialchars($message, ENT_QUOTES);
            $this->send(
                $u,
                '<span style="color:'.$msg->color.'">'.$msg->name.' - '.$msg->message.'</span>
            ');
        }
    }
  }

  protected function connected ($user) {
    // Do nothing: This is just an echo server, there's no need to track the user.
    // However, if we did care about the users, we would probably have a cookie to
    // parse at this step, would be looking them up in permanent storage, etc.
    foreach($this->users as $u) {
        $message = htmlspecialchars($message);
        $this->send($u, "<b>".$user->id." has joined the room.</b>");
    }
  }

  protected function closed ($user) {
    // Do nothing: This is where cleanup would go, in case the user had any sort of
    // open files or other objects associated with them.  This runs after the socket
    // has been closed, so there is no need to clean up the socket itself here.
  }
}

$echo = new ChatServer("0.0.0.0","9000");

try {
  $echo->run();
}
catch (Exception $e) {
  $echo->stdout($e->getMessage());
}
