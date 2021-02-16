# Set Cypress environment variables for containerized environment

SKIP_ENV_OUTPUT=yes source ./hacks/cypress_env_local.sh

# Overwrite variables
export CYPRESS_BASE_URL=http://192.168.0.126:3000

# Print all
env | grep CYPRESS_ | sort

