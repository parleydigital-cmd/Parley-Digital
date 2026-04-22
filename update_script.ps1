$files = @(
    "services.html",
    "portfolio.html",
    "privacy-policy.html",
    "terms.html",
    "contact.html"
)

$topBarTarget = '<div class="top-bar-content">
          <span><i class="fa-solid fa-phone"></i> \+91 9711 096 005</span>
          <span><i class="fa-solid fa-envelope"></i> info@parleydigital\.com</span>
        </div>'
$topBarReplacement = '<div class="top-bar-content" style="justify-content: center;">
          <span>📅 Serving Local Businesses Across the USA — Remote & Results-Driven</span>
        </div>'

$navBtnTarget = '<a href="contact\.html" class="btn-primary">Get Free Audit</a>'
$navBtnReplacement = '<a href="index.html#lead-form" class="btn-primary">Get Free Audit</a>'

$navTarget = '<nav class="main-nav">'
$navReplacement = '<div class="urgency-bar" style="background-color: #042C53; color: white; font-size: 14px; text-align: center; padding: 10px; width: 100%;">
      Only 5 client spots open this month — Claim yours before they''re gone
    </div>
    <nav class="main-nav">'

$footerTaglineTarget = '<p class="tagline">Generating revenue through data-driven digital marketing\.</p>'
$footerTaglineReplacement = '<p class="tagline">Generating revenue through data-driven digital marketing.</p>
          <div style="margin-top:20px; margin-bottom: 20px;">
            <a href="index.html#lead-form" class="btn-primary" style="padding:10px 20px; font-size:14px;">Get Free Audit</a>
          </div>'

$footerAddrTarget = '317 Vaishav Enclave,<br>
            Gurugram 122101<br><br>
            <a href="mailto:info@parleydigital\.com">info@parleydigital\.com</a><br>
            <a href="tel:\+919711096005">\+91 9711 096 005</a>'
$footerAddrReplacement = '<a href="mailto:info@parleydigital.com">info@parleydigital.com</a><br>
            <span style="display:block; margin:10px 0; color:var(--color-gray);">Response within 24 hours</span>
            <span style="color:var(--color-gray);">Serving clients across the USA</span>'

foreach ($file in $files) {
    $path = "c:\Users\hopki\OneDrive\Desktop\Neel\parleydigital\$file"
    $content = Get-Content -Raw -Path $path
    
    $content = [regex]::Replace($content, $topBarTarget, $topBarReplacement)
    $content = [regex]::Replace($content, $navBtnTarget, $navBtnReplacement)
    
    if (-not $content.Contains('class="urgency-bar"')) {
        $content = [regex]::Replace($content, $navTarget, $navReplacement)
    }
    
    $content = [regex]::Replace($content, $footerTaglineTarget, $footerTaglineReplacement)
    $content = [regex]::Replace($content, $footerAddrTarget, $footerAddrReplacement)
    
    Set-Content -Path $path -Value $content -NoNewline
}

Write-Host "Replaced common blocks"
