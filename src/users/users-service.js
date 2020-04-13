const UsersService = {
    getAllUsers(knex){
        return knex
        .select('*')
        .from('users')
    }, 
    getById(knex, id){
        return knex
        .from('users')
        .select('*')
        .where('id', id)
        .first()
    }, 
    insertUser(knex, newUser){
        return knex
        .insert(newUser)
        .into('users')
        .returning('*')
        .then(rows => {
            return rows[0]
        })
    }, 
    updateUser(knex, id, newFields){
        return knex('users')
        .where({id})
        .update(newFields)
    }, 
    deleteUser(knex, id){
        return knex('users')
        .where({id})
        .delete()
    }
}

module.exports = UsersService