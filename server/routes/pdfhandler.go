// package routes

// import (
// 	"bytes"
// 	"encoding/json"
// 	"fmt"
// 	"net/http"
// 	"strconv"
// 	"strings"

// 	"github.com/gin-gonic/gin"
// 	"github.com/jung-kurt/gofpdf"
// )

// // POST /api/convert/json-to-pdf
// func ConvertJsonToPDF(c *gin.Context) {
// 	var jsonData []map[string]interface{}
// 	if err := c.BindJSON(&jsonData); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON", "details": err.Error()})
// 		return
// 	}
// 	if len(jsonData) == 0 {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": "empty data"})
// 		return
// 	}

// 	// ----- DYNAMIC HEADER LOGIC -----
// 	headerMap := map[string]bool{}
// 	orderedHeaders := []string{}
// 	for _, row := range jsonData {
// 		for k := range row {
// 			if !headerMap[k] {
// 				headerMap[k] = true
// 				orderedHeaders = append(orderedHeaders, k)
// 			}
// 		}
// 	}

// 	// Assign adaptive column widths (make "items", "vendor", "notes" and such wider if present)
// 	defaultW := 25.0
// 	widerW := 55.0
// 	// Calculate the total width of the content area
// 	pageWidth := 297.0 // A4 landscape width in mm
// 	margin := 10.0
// 	contentWidth := pageWidth - (2 * margin)
// 	totalDefaultW := 0.0
// 	numWiderCols := 0
// 	numDefaultCols := 0

// 	for _, col := range orderedHeaders {
// 		switch strings.ToLower(col) {
// 		case "items", "vendor", "notes", "products":
// 			numWiderCols++
// 		default:
// 			numDefaultCols++
// 			totalDefaultW += defaultW
// 		}
// 	}

// 	colWidths := make([]float64, len(orderedHeaders))
// 	// Adjust widths to fit the page
// 	remainingWidth := contentWidth - (float64(numWiderCols) * widerW)
// 	if remainingWidth < 0 {
// 		// Fallback: If wider columns alone exceed page width, give them a reasonable, equal width
// 		widerW = contentWidth / float64(len(orderedHeaders))
// 		defaultW = widerW
// 		for i := range colWidths {
// 			colWidths[i] = widerW
// 		}
// 	} else {
// 		// Distribute remaining width among default columns
// 		if numDefaultCols > 0 {
// 			defaultW = remainingWidth / float64(numDefaultCols)
// 		}
// 		for i, col := range orderedHeaders {
// 			switch strings.ToLower(col) {
// 			case "items", "vendor", "notes", "products":
// 				colWidths[i] = widerW
// 			default:
// 				colWidths[i] = defaultW
// 			}
// 		}
// 	}

// 	pdf := gofpdf.New("L", "mm", "A4", "")
// 	pdf.AddPage()
// 	pdf.SetFont("Arial", "B", 14)
// 	pdf.Cell(80, 12, "Data Table") // wider cell
// 	pdf.Ln(13)

// 	pdf.SetFont("Arial", "B", 9)
// 	rowHeight := 7.0

// 	// Headers
// 	for i, h := range orderedHeaders {
// 		pdf.CellFormat(colWidths[i], rowHeight, prettifyHeader(h), "1", 0, "C", false, 0, "")
// 	}
// 	pdf.Ln(-1)

// 	// Rows
// 	pdf.SetFont("Arial", "", 8)
// 	for _, row := range jsonData {
// 		for i, h := range orderedHeaders {
// 			val := ""
// 			if v, ok := row[h]; ok {
// 				val = prettifyValue(h, v)
// 			}
// 			pdf.CellFormat(colWidths[i], 6, val, "1", 0, "L", false, 0, "")
// 		}
// 		pdf.Ln(-1)
// 	}

// 	var buf bytes.Buffer
// 	err := pdf.Output(&buf)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed PDF generation", "details": err.Error()})
// 		return
// 	}

// 	c.Header("Content-Type", "application/pdf")
// 	c.Header("Content-Disposition", "attachment; filename=\"data.pdf\"")
// 	c.Data(http.StatusOK, "application/pdf", buf.Bytes())
// }

// // Prettify header names (optional: make "po_number" → "PO Number", etc)
// func prettifyHeader(header string) string {
// 	header = strings.ReplaceAll(header, "_", " ")
// 	header = strings.Title(header)
// 	return header
// }

// // Pretty print/truncate long/nested fields
// func prettifyValue(col string, v interface{}) string {
// 	switch vv := v.(type) {
// 	case nil:
// 		return ""
// 	case string:
// 		if len(vv) > 36 {
// 			return vv[:35] + "…"
// 		}
// 		return vv
// 	case float64:
// 		return strconv.FormatFloat(vv, 'f', -1, 64)
// 	case int:
// 		return strconv.Itoa(vv)
// 	case int32:
// 		return strconv.FormatInt(int64(vv), 10)
// 	case int64:
// 		return strconv.FormatInt(vv, 10)
// 	case bool:
// 		if vv {
// 			return "true"
// 		}
// 		return "false"
// 	case []interface{}, map[string]interface{}:
// 		// Compact JSON, truncate if too long
// 		b, _ := json.Marshal(vv)
// 		s := string(b)
// 		if len(s) > 46 {
// 			return s[:45] + "…"
// 		}
// 		return s
// 	default:
// 		s := fmt.Sprintf("%v", v)
// 		if len(s) > 36 {
// 			return s[:35] + "…"
// 		}
// 		return s
// 	}
// }


package routes

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jung-kurt/gofpdf"
)

// POST /api/convert/json-to-pdf
func ConvertJsonToPDF(c *gin.Context) {
	var jsonData []map[string]interface{}
	if err := c.BindJSON(&jsonData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON", "details": err.Error()})
		return
	}
	if len(jsonData) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "empty data"})
		return
	}

	// ----- DYNAMIC HEADER LOGIC -----
	headerMap := map[string]bool{}
	orderedHeaders := []string{}
	for _, row := range jsonData {
		for k := range row {
			if !headerMap[k] {
				headerMap[k] = true
				orderedHeaders = append(orderedHeaders, k)
			}
		}
	}

	// Assign adaptive column widths
	defaultW := 25.0
	widerW := 45.0
	pageWidth := 297.0 // A4 landscape width in mm
	margin := 10.0
	contentWidth := pageWidth - (2 * margin)
	totalDefaultW := 0.0
	numWiderCols := 0
	numDefaultCols := 0

	// COUNT WIDER COLUMNS (including any column with "id" in its name)
	for _, col := range orderedHeaders {
		lowerCol := strings.ToLower(col)
		if strings.Contains(lowerCol, "id") || 
		   lowerCol == "items" || 
		   lowerCol == "vendor" || 
		   lowerCol == "notes" || 
		   lowerCol == "products" {
			numWiderCols++
		} else {
			numDefaultCols++
			totalDefaultW += defaultW
		}
	}

	colWidths := make([]float64, len(orderedHeaders))
	remainingWidth := contentWidth - (float64(numWiderCols) * widerW)
	if remainingWidth < 0 {
		widerW = contentWidth / float64(len(orderedHeaders))
		defaultW = widerW
		for i := range colWidths {
			colWidths[i] = widerW
		}
	} else {
		if numDefaultCols > 0 {
			defaultW = remainingWidth / float64(numDefaultCols)
		}
		// ASSIGN WIDTHS (wider for ID-related columns)
		for i, col := range orderedHeaders {
			lowerCol := strings.ToLower(col)
			if strings.Contains(lowerCol, "id") || 
			   lowerCol == "items" || 
			   lowerCol == "vendor" || 
			   lowerCol == "notes" || 
			   lowerCol == "products" {
				colWidths[i] = widerW
			} else {
				colWidths[i] = defaultW
			}
		}
	}

	pdf := gofpdf.New("L", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 14)
	pdf.Cell(60, 12, "Data Table")
	pdf.Ln(13)

	pdf.SetFont("Arial", "B", 9)
	rowHeight := 7.0

	// Headers
	for i, h := range orderedHeaders {
		pdf.CellFormat(colWidths[i], rowHeight, prettifyHeader(h), "1", 0, "C", false, 0, "")
	}
	pdf.Ln(-1)

	// Rows
	pdf.SetFont("Arial", "", 8)
	for _, row := range jsonData {
		for i, h := range orderedHeaders {
			val := ""
			if v, ok := row[h]; ok {
				val = prettifyValue(h, v)
			}
			pdf.CellFormat(colWidths[i], 6, val, "1", 0, "L", false, 0, "")
		}
		pdf.Ln(-1)
	}

	var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed PDF generation", "details": err.Error()})
		return
	}

	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", "attachment; filename=\"data.pdf\"")
	c.Data(http.StatusOK, "application/pdf", buf.Bytes())
}

func prettifyHeader(header string) string {
	header = strings.ReplaceAll(header, "_", " ")
	header = strings.Title(header)
	return header
}

func prettifyValue(col string, v interface{}) string {
	
	switch vv := v.(type) {
	case nil:
		return ""
	case string:
		if len(vv) > 36 {
			return vv[:35] + "…"
		}
		return vv
	case float64:
		return strconv.FormatFloat(vv, 'f', -1, 64)
	case int:
		return strconv.Itoa(vv)
	case int32:
		return strconv.FormatInt(int64(vv), 10)
	case int64:
		return strconv.FormatInt(vv, 10)
	case bool:
		if vv {
			return "true"
		}
		return "false"
	case []interface{}, map[string]interface{}:
		b, _ := json.Marshal(vv)
		s := string(b)
		if len(s) > 46 {
			return s[:45] + "…"
		}
		return s
	default:
		s := fmt.Sprintf("%v", v)
		if len(s) > 36 {
			return s[:35] + "…"
		}
		return s
	}
}