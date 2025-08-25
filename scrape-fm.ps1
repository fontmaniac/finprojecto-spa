$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$outputFile = "for-ai.md"
Set-Content -Path $outputFile -Value "# 🤖 Context Scaffold for LLM Assistants`n"

Get-ChildItem -Recurse -Include *.js, *.jsx | Where-Object { $_.FullName -notmatch '\\node_modules\\' } | ForEach-Object {
    $filePath = $_.FullName
    $relativePath = $filePath.Substring((Get-Location).Path.Length + 1)
    $content = Get-Content $filePath

    $fmLines = @()
    $inFMBlock = $false

    foreach ($line in $content) {
        # Match FM/NB/Frontmatter on any comment line
        if ($line -match '^\s*(//|/\*|\*)?\s*(FM:|Frontmatter:|NB:)\s*(.*)') {
            $tag = $matches[2]
            $note = $matches[3].Trim().TrimEnd('*/').Trim()

            # Check if it's a single-line block comment
            if ($line -match '/\*.*\*/') {
                $fmLines += "$tag $note"
                continue
            }

            $fmLines += "$tag $note"
            $inFMBlock = $true
            continue
        }

        if ($inFMBlock) {
            $cleaned = $line.Trim().TrimStart('*').Trim().TrimEnd('*/').Trim()
            if ($cleaned -ne '') { $fmLines += $cleaned }
            if ($line -match '\*/') { $inFMBlock = $false }
        }
    }

    if ($fmLines.Count -gt 0) {
        Add-Content -Path $outputFile -Value "`n---`nFile: $relativePath`nAsOf: $timestamp"
        foreach ($line in $fmLines) {
            Add-Content -Path $outputFile -Value $line
        }
    }
}
