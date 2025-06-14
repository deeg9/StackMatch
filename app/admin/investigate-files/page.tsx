"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Database, FileText, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function AdminFileInvestigationPage() {
  const [loading, setLoading] = useState(false)
  const [investigation, setInvestigation] = useState<any>(null)
  const { toast } = useToast()

  const runInvestigation = async () => {
    console.log("🔍 ADMIN INVESTIGATION CLIENT: Starting investigation...")
    console.log("🔍 ADMIN INVESTIGATION CLIENT: Timestamp:", new Date().toISOString())

    setLoading(true)
    try {
      console.log("🔍 ADMIN INVESTIGATION CLIENT: Making API request...")

      const response = await fetch("/api/admin/investigate-files", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })

      console.log("🔍 ADMIN INVESTIGATION CLIENT: Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log("🔍 ADMIN INVESTIGATION CLIENT: Error response body:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }

        throw new Error(
          `HTTP ${response.status}: ${response.statusText} - ${errorData.error || errorData.details || errorText}`,
        )
      }

      const data = await response.json()
      console.log("🔍 ADMIN INVESTIGATION CLIENT: Success response:", data)

      setInvestigation(data.investigation)

      toast({
        title: "Investigation Complete",
        description: "File system investigation completed successfully",
      })

      console.log("🔍 ADMIN INVESTIGATION CLIENT: Investigation completed successfully")
    } catch (error) {
      console.error("🔍 ADMIN INVESTIGATION CLIENT: Error:", error)

      toast({
        title: "Investigation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      console.log("🔍 ADMIN INVESTIGATION CLIENT: Investigation finished")
    }
  }

  const StatusIcon = ({ status }: { status: boolean | undefined }) => {
    if (status === true) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (status === false) return <XCircle className="h-4 w-4 text-red-600" />
    return <AlertCircle className="h-4 w-4 text-yellow-600" />
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin: File System Investigation</h1>
          <p className="text-muted-foreground">
            Investigate the current file storage structure and find existing files
          </p>
          <p className="text-sm text-blue-600 mt-1">Check browser console for detailed logs during investigation</p>
        </div>
        <Button onClick={runInvestigation} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Investigating...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Run Investigation
            </>
          )}
        </Button>
      </div>

      {investigation && (
        <div className="grid gap-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Investigation Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {investigation.findings?.dealRoomFiles?.count || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Deal Room Files</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {investigation.findings?.targetListing?.found ? "Found" : "Not Found"}
                  </div>
                  <div className="text-sm text-muted-foreground">Target Listing</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {investigation.findings?.targetProposal?.found ? "Found" : "Not Found"}
                  </div>
                  <div className="text-sm text-muted-foreground">Target Proposal</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {investigation.findings?.alternativeTables
                      ? Object.values(investigation.findings.alternativeTables).filter((table: any) => table.exists)
                          .length
                      : 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Alt File Tables</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deal Room Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <StatusIcon status={investigation.findings?.dealRoomFiles?.exists} />
                <span className="ml-2">Deal Room Files Table</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <strong>Exists:</strong> {investigation.findings?.dealRoomFiles?.exists ? "Yes" : "No"}
                </div>
                <div>
                  <strong>Count:</strong> {investigation.findings?.dealRoomFiles?.count || 0}
                </div>
                {investigation.findings?.dealRoomFiles?.error && (
                  <div className="text-red-600">
                    <strong>Error:</strong> {investigation.findings.dealRoomFiles.error}
                  </div>
                )}
                {investigation.findings?.dealRoomFiles?.sample && (
                  <div>
                    <strong>Sample Files:</strong>
                    <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-x-auto max-h-32">
                      {JSON.stringify(investigation.findings.dealRoomFiles.sample, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Target Listing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <StatusIcon status={investigation.findings?.targetListing?.found} />
                <span className="ml-2">Target Listing Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {investigation.findings?.targetListing?.found ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>ID:</strong> {investigation.findings.targetListing.id}
                    </div>
                    <div>
                      <strong>Title:</strong> {investigation.findings.targetListing.title}
                    </div>
                    <div>
                      <strong>Created:</strong>{" "}
                      {new Date(investigation.findings.targetListing.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <strong>Buyer ID:</strong> {investigation.findings.targetListing.buyerId}
                    </div>
                  </div>

                  <div>
                    <strong>Total Columns:</strong> {investigation.findings.targetListing.allColumns?.length || 0}
                  </div>

                  {investigation.findings.targetListing.fileColumns &&
                    investigation.findings.targetListing.fileColumns.length > 0 && (
                      <div>
                        <strong>File-Related Columns:</strong>
                        <div className="mt-1 space-y-1">
                          {investigation.findings.targetListing.fileColumns.map((col: any) => (
                            <div key={col.column} className="flex items-center justify-between p-2 border rounded">
                              <span className="font-medium">{col.column}</span>
                              <div className="text-sm">
                                <span className={`${col.hasData ? "text-green-600" : "text-gray-500"}`}>
                                  {col.hasData ? "Has Data" : "Empty"}
                                </span>
                                <span className="ml-2 text-gray-400">({col.type})</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {investigation.findings.targetListing.potentialFileData &&
                    investigation.findings.targetListing.potentialFileData.length > 0 && (
                      <div>
                        <strong>Potential File Data:</strong>
                        <div className="mt-1 space-y-1">
                          {investigation.findings.targetListing.potentialFileData.map((col: any) => (
                            <div key={col.column} className="p-2 border rounded">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{col.column}</span>
                                <span className="text-sm text-gray-500">
                                  {col.type} ({col.length} chars)
                                </span>
                              </div>
                              {col.type === "object" ? (
                                <pre className="text-xs mt-1 overflow-x-auto bg-gray-50 p-1 rounded max-h-20">
                                  {JSON.stringify(col.value, null, 2)}
                                </pre>
                              ) : (
                                <div className="text-xs mt-1 text-gray-600 truncate">
                                  {String(col.value).substring(0, 200)}
                                  {String(col.value).length > 200 && "..."}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {investigation.findings.targetListing.jsonFileColumns &&
                    investigation.findings.targetListing.jsonFileColumns.length > 0 && (
                      <div>
                        <strong>JSON File Columns:</strong>
                        <div className="mt-1 space-y-1">
                          {investigation.findings.targetListing.jsonFileColumns.map((col: any) => (
                            <div key={col.column} className="p-2 border rounded">
                              <div className="font-medium">{col.column}</div>
                              <pre className="text-xs mt-1 overflow-x-auto bg-gray-50 p-1 rounded max-h-20">
                                {JSON.stringify(col.value, null, 2)}
                              </pre>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-red-600">
                  Listing not found: {investigation.findings?.targetListing?.error}
                  <div className="text-sm mt-1">Searched ID: {investigation.findings?.targetListing?.searchedId}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Target Proposal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <StatusIcon status={investigation.findings?.targetProposal?.found} />
                <span className="ml-2">Target Proposal Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {investigation.findings?.targetProposal?.found ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>ID:</strong> {investigation.findings.targetProposal.id}
                    </div>
                    <div>
                      <strong>Listing ID:</strong> {investigation.findings.targetProposal.listingId}
                    </div>
                    <div>
                      <strong>Seller ID:</strong> {investigation.findings.targetProposal.sellerId}
                    </div>
                    <div>
                      <strong>Created:</strong>{" "}
                      {new Date(investigation.findings.targetProposal.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <strong>Total Columns:</strong> {investigation.findings.targetProposal.allColumns?.length || 0}
                  </div>

                  {investigation.findings.targetProposal.potentialFileData &&
                    investigation.findings.targetProposal.potentialFileData.length > 0 && (
                      <div>
                        <strong>Potential File Data:</strong>
                        <div className="mt-1 space-y-1">
                          {investigation.findings.targetProposal.potentialFileData.map((col: any) => (
                            <div key={col.column} className="p-2 border rounded">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">{col.column}</span>
                                <span className="text-sm text-gray-500">
                                  {col.type} ({col.length} chars)
                                </span>
                              </div>
                              {col.type === "object" ? (
                                <pre className="text-xs mt-1 overflow-x-auto bg-gray-50 p-1 rounded max-h-20">
                                  {JSON.stringify(col.value, null, 2)}
                                </pre>
                              ) : (
                                <div className="text-xs mt-1 text-gray-600 truncate">
                                  {String(col.value).substring(0, 200)}
                                  {String(col.value).length > 200 && "..."}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="text-red-600">
                  Proposal not found: {investigation.findings?.targetProposal?.error}
                  <div className="text-sm mt-1">Searched ID: {investigation.findings?.targetProposal?.searchedId}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alternative Tables */}
          <Card>
            <CardHeader>
              <CardTitle>Alternative File Storage Tables</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {investigation.findings?.alternativeTables &&
                  Object.entries(investigation.findings.alternativeTables).map(
                    ([tableName, tableInfo]: [string, any]) => (
                      <div key={tableName} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center">
                          <StatusIcon status={tableInfo.exists} />
                          <span className="ml-2 font-medium">{tableName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {tableInfo.exists ? `${tableInfo.count} records` : "Not found"}
                          {tableInfo.error && ` (${tableInfo.error})`}
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Raw Investigation Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Raw Investigation Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-x-auto bg-muted p-4 rounded max-h-96">
                {JSON.stringify(investigation, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </div>
      )}

      {!investigation && !loading && (
        <Card>
          <CardContent className="text-center py-12">
            <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Ready to Investigate</h3>
            <p className="text-muted-foreground mb-4">
              Click "Run Investigation" to analyze the current file storage structure
            </p>
            <p className="text-sm text-blue-600">Open browser console to see detailed investigation logs</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
