package main

import (
	"fmt"
	"net"

	// "strings"
	"os"
)

const (
	PORT    = "8080"
	IP      = "127.0.0.1"
	ADDRESS = IP + ":" + PORT
)

func main() {
	listener, err := net.Listen("tcp", ADDRESS)
	if err != nil {
		fmt.Println("Error listening:", err)
		os.Exit(1)
	}
	defer listener.Close()

	fmt.Println("Server listening on: ", ADDRESS)
}
