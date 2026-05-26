const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* =========================
   REGISTRO
========================= */
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // validação básica
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Preencha todos os campos'
            });
        }

        // verifica usuário existente
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({
                error: 'Email já cadastrado'
            });
        }

        // criptografa senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // salva usuário
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    name,
                    email,
                    password: hashedPassword
                }
            ])
            .select();

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: data[0]
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // busca usuário
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user || error) {
            return res.status(400).json({
                error: 'Usuário não encontrado'
            });
        }

        // verifica senha
        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                error: 'Senha incorreta'
            });
        }

        // gera token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '7d'
            }
        );

        res.json({
            message: 'Login realizado',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};