$files = @(
    "index.html",
    "services.html",
    "portfolio.html",
    "privacy-policy.html",
    "terms.html",
    "contact.html"
)

$whatsappTarget = '  <!-- WhatsApp Floating Button -->
  <a href="https://wa\.me/919711096005\?text=Hi%2C%20I%27m%20interested%20in%20your%20services" class="whatsapp-btn" target="_blank" title="Chat with us" aria-label="Chat with us on WhatsApp">
    <i class="fa-brands fa-whatsapp"></i>
  </a>'

foreach ($file in $files) {
    $path = "c:\Users\hopki\OneDrive\Desktop\Neel\parleydigital\$file"
    $content = Get-Content -Raw -Path $path
    
    $content = [regex]::Replace($content, $whatsappTarget, '')
    
    Set-Content -Path $path -Value $content -NoNewline
}

Write-Host "Removed Whatsapp buttons"
