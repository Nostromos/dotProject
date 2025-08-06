package handlers

import (
	"net/http/httptest"
	// "strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestProjectHandler(t *testing.T) {
	tests := []struct {
		name     string
		method   string
		url      string
		body     string
		wantCode int
		wantJSON string
	}{
		{name: "happy path", method: "GET", url: "/projects/123", body: "", wantCode: 200, wantJSON: `{"id":123}`},
		{name: "not found", method: "GET", url: "/projects/999", body: "", wantCode: 404, wantJSON: `{"error":"not found"}`},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			// req := httptest.NewRequest(tc.method, tc.url, strings.NewReader(tc.body))
			resp := httptest.NewRecorder()

			// router.ServeHTTP(resp, req)

			assert.Equal(t, tc.wantCode, resp.Code)
			assert.JSONEq(t, tc.wantJSON, resp.Body.String())
		})
	}
}
