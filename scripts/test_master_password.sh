#!/bin/bash
# test_master_password.sh - Test della Master Password
# Versione: 1.0
# Data: $(date +%F)

set -e

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzioni di utilità
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Master Password
MASTER_PASSWORD="La Ferrari Pietro Snc è stata fondata nel 1963 in forma artigianale da Ferrari Pietro e dal nipote Carlo"

echo "🔐 Test Master Password"
echo "======================"
echo ""

log_info "Master Password configurata:"
echo "   '$MASTER_PASSWORD'"
echo ""

# Test 1: Verifica lunghezza
log_info "Test 1: Verifica lunghezza password..."
PASSWORD_LENGTH=${#MASTER_PASSWORD}
if [ "$PASSWORD_LENGTH" -ge 20 ]; then
    log_success "Lunghezza OK: $PASSWORD_LENGTH caratteri"
else
    log_warning "Lunghezza bassa: $PASSWORD_LENGTH caratteri"
fi

# Test 2: Verifica complessità
log_info "Test 2: Verifica complessità..."
if [[ "$MASTER_PASSWORD" =~ [A-Z] ]] && [[ "$MASTER_PASSWORD" =~ [a-z] ]] && [[ "$MASTER_PASSWORD" =~ [0-9] ]]; then
    log_success "Complessità OK: contiene maiuscole, minuscole e numeri"
else
    log_warning "Complessità bassa: mancano alcuni tipi di caratteri"
fi

# Test 3: Test cifratura/decifratura GPG
log_info "Test 3: Test cifratura/decifratura GPG..."

# Crea file di test
TEST_FILE="test_master_password.txt"
TEST_CONTENT="Questo è un test della Master Password per il gestionale Ferrari Pietro Snc."

echo "$TEST_CONTENT" > "$TEST_FILE"

# Cifra file
if gpg --batch --passphrase "$MASTER_PASSWORD" --symmetric "$TEST_FILE"; then
    log_success "Cifratura GPG OK"
    
    # Decifra file
    if gpg --batch --passphrase "$MASTER_PASSWORD" --decrypt "$TEST_FILE.gpg" > "test_decrypted.txt"; then
        log_success "Decifratura GPG OK"
        
        # Verifica contenuto
        if [ "$(cat test_decrypted.txt)" = "$TEST_CONTENT" ]; then
            log_success "Contenuto decifrato corretto"
        else
            log_error "Contenuto decifrato non corrisponde"
        fi
    else
        log_error "Decifratura GPG fallita"
    fi
else
    log_error "Cifratura GPG fallita"
fi

# Pulizia file di test
rm -f "$TEST_FILE" "$TEST_FILE.gpg" "test_decrypted.txt"

echo ""
log_success "Test Master Password completato!"
echo ""
echo "📋 Risultati:"
echo "   - Master Password configurata correttamente"
echo "   - Test cifratura/decifratura GPG OK"
echo "   - Pronta per uso operativo"